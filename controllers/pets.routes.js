const isSignedIn = require("../middleware/is-signed-in");
const Pet = require("../models/Pet");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp"];
    if (allowed.includes(file.mimetype)) return cb(null, true);
    cb(new Error("INVALID_FILE_TYPE"));
  },
});

const router = require("express").Router();

router.get("/", async (req, res) => {
  const allPets = await Pet.find().populate("owner");
  res.render("pets/all-pets.ejs", { allPets });
});

router.get("/list-a-pet", isSignedIn, async (req, res) => {
  try {
    res.render("pets/list-a-pet.ejs");
  } catch (error) {
    console.log(error);
  }
});

router.post(
  "/list-a-pet",
  isSignedIn,
  (req, res, next) => {
    upload.single("picture")(req, res, (err) => {
      if (err) {
        const msg =
          err.message == "INVALID_FILE_TYPE"
            ? "Only JPG, PNG, or WEBP images are allowed."
            : "Image upload failed. Max size is 2MB.";
        return res.render("pets/list-a-pet.ejs", { error: msg });
      }
      next();
    });
  },
  async (req, res) => {
    if (!req.file) {
      return res.render("pets/list-a-pet.ejs", {
        error: "Please upload a picture.",
      });
    }

    await Pet.create({
      ...req.body,
      owner: req.session.user._id,
      picture: `/uploads/${req.file.filename}`,
    });

    res.redirect("/pets/my-pets");
  },
);

router.get("/my-pets", isSignedIn, async (req, res) => {
  const myPets = await Pet.find({ owner: req.session.user._id });
  res.render("pets/my-pets.ejs", { myPets });
});

router.get("/:id/edit", isSignedIn, async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet || !pet.owner || !pet.owner.equals(req.session.user._id)) {
    return res.redirect("/pets/my-pets");
  }

  res.render("pets/edit-pet.ejs", { pet });
});

router.get("/:id", async (req, res) => {
  const pet = await Pet.findById(req.params.id).populate("owner");
  if (!pet) return res.redirect("/pets");

  res.render("pets/pet-details.ejs", { pet });
});

router.post(
  "/:id/edit",
  isSignedIn,
  (req, res, next) => {
    upload.single("picture")(req, res, async (err) => {
      const pet = await Pet.findById(req.params.id);

      if (!pet || !pet.owner || !pet.owner.equals(req.session.user._id)) {
        return res.redirect("/pets/my-pets");
      }

      if (err) {
        const msg =
          err.message == "INVALID_FILE_TYPE"
            ? "Only JPG, PNG, or WEBP images are allowed."
            : "Image upload failed. Max size is 2MB.";
        return res.render("pets/edit-pet.ejs", { pet, error: msg });
      }

      req.petFromDb = pet;
      next();
    });
  },
  async (req, res) => {
    const pet = req.petFromDb;

    const updatedData = { ...req.body };

    if (req.file) {
      updatedData.picture = `/uploads/${req.file.filename}`;
    } else {
      updatedData.picture = pet.picture;
    }

    await Pet.findByIdAndUpdate(req.params.id, updatedData);
    res.redirect("/pets/my-pets");
  },
);

router.post("/:id/delete", isSignedIn, async (req, res) => {
  const pet = await Pet.findById(req.params.id);

  if (!pet || !pet.owner || !pet.owner.equals(req.session.user._id)) {
    return res.redirect("/pets/my-pets");
  }

  await Pet.findByIdAndDelete(req.params.id);
  res.redirect("/pets/my-pets");
});

module.exports = router;

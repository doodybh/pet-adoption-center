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

const upload = multer({ storage });

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
  upload.single("picture"),
  async (req, res) => {
    const listedPet = await Pet.create({
      ...req.body,
      owner: req.session.user._id,
      picture: req.file ? `/uploads/${req.file.filename}` : "",
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
  upload.single("picture"),
  async (req, res) => {
    const pet = await Pet.findById(req.params.id);

    if (!pet || !pet.owner || !pet.owner.equals(req.session.user._id)) {
      return res.redirect("/pets/my-pets");
    }

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

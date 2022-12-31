const express = require("express");
const router = express.Router();
const auth = require("../../../middleware/auth.js");
const Profile = require("../../../models/Profile.js");
const User = require("../../../models/User.js");
const { check, validationResult } = require("express-validator");


router.get("/me", auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        id }).populate(
      "user",
      ["name", "avatar"]
    );
    if (!profile) {
      return res.sendStatus(400).json({ msg: "there is no profile of this user" });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("servor error");
  }
});

router.post(
  "/",                                                                                                        
  [
    auth,
    [
      check("status", "Status is required").notEmpty(),
      check("skills", "Skills is required").notEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      company,
      website,
      location,
      bio,
      status,
      githubusername,
      skills,
      youtube,
      facebook,
      twitter,
      instagram,
      linkedin,
    } = req.body;

    const profileFeilds = {};

    profileFeilds.user = req.user.id;
    if (company) profileFeilds.company = company;
    if (website) profileFeilds.website = website;
    if (location) profileFeilds.location = location;
    if (bio) profileFeilds.bio = bio;
    if (status) profileFeilds.status = status;
    if (githubusername) profileFeilds.githubusername = githubusername;
    if (skills) {
      profileFeilds.skills = skills.split(",").map((skill) => skill.trim());
    }

    profileFeilds.social = {};
    if (youtube) profileFeilds.social.youtube = youtube;
    if (facebook) profileFeilds.social.facebook = facebook;
    if (twitter) profileFeilds.social.twitter = twitter;
    if (linkedin) profileFeilds.social.linkedin = linkedin;
    if (instagram) profileFeilds.social.instagram = instagram;

    try {
      let profile = await Profile.findOne({ user: req.user.id });

      if (profile) {
        profile = await Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFeilds },
          { new: true }
        );

        return res.json(profile);
      }

      //creating a post
      profile = new Profile(profileFeilds);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send("servor error");
    }

    console.log(profileFeilds.skills);

    res.send("hi");
  }
);


router.get('/', async (req,res) =>{
    try {
        const profile = await Profile.find().populate('user', ['name','avatar'])
        res.json(profile)
    
    } catch (err) {
        console.error(err.message)
    }
})


router.get("/user/:user_id", async(req,res)=>{
    try {
        const profile = await Profile.findOne({ user: req.params.user_id }).populate('user',['name','avatar'])
        
        if(!profile){
            return res.status(400).json({ msg: 'there is no profile for this id'})
        }
        
        res.json(profile)
        

    } catch (err) {
        console.error(err.message)
        if(err.kind=='ObjectId'){

            return res.status(400).json({ msg: 'Profile not found'})
        }
        res.status(500).send("servor error")

    }
})


router.delete('/', auth, async (req,res)=>{
  await Profile.findOneAndRemove({user: req.user.id})

  await User.findOneAndRemove({ _id :req.user.id })

  res.json({msg:"user deleted"})
})


router.put('/experience', auth,
  check('title','title is required').notEmpty(),
  check('company','company is required').notEmpty(),
  // check('from',' Date  is required').notEmpty(),

  async (req,res)=>{
  const error = validationResult(req)

  if(!error.isEmpty()){
    return res.status(400).json({error:error.array()})

  }

  const {
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }=req.body

  const newExp ={
    title,
    company,
    location,
    from,
    to,
    current,
    description
  }

  try {
    const profile = await Profile.findOne({ user: req.user.id })
    // console.log(req.user.id)
    profile.experience.unshift(newExp)

    await profile.save();

    res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.status(500).send("servor error")
  }
  
})

router.delete('experience/:exp_id',auth, async(req,res)=>{
  try {
   const profile = await Profile.findOne({ user:req.user.id })
    const removeIndex = profile.experience.map(item=>item.id).indexOf(req.params.exp_id);

    profile.experience.splice(removeIndex, 1)
   await profile.save()

   res.json(profile)

  } catch (err) {
    console.error(err.message)
    res.status(500).send("servor error")
  }
})

module.exports = router;

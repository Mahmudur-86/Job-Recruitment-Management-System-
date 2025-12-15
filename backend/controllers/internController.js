const InternRequest = require("../models/InternRequest");


exports.submitInternRequest = async (req, res) => {
  const intern = await InternRequest.create({
    user: req.user.id,
    ...req.body
  });

 

  res.json(intern);
};

exports.getMyInternRequests = async (req, res) => {
  const list = await InternRequest.find({ user: req.user.id })
    .sort({ createdAt: -1 });

  res.json(list);
};

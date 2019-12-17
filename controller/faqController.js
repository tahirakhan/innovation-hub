const express = require('express');
const router = express.Router();
var faqList = [
    'You can create a Purchase Request 1 using or Vroozi mobile app, Vroozi web solution or using Vroozi SmartAssistant. You need to login to use this Feature.',
    'You can create a Purchase Request 2 using or Vroozi mobile app, Vroozi web solution or using Vroozi SmartAssistant. You need to login to use this Feature.',
    'You can create a Purchase Request 3 using or Vroozi mobile app, Vroozi web solution or using Vroozi SmartAssistant. You need to login to use this Feature.' ];

router.get("/", (req, res) => {
  res.send(faqList[req.body.faqId]);
});

module.exports = router;
const express = require("express");
const router = express.Router();
const tinygradient = require('tinygradient');
var convert = require('color-convert');

const data = {
  checkmarks: [true, true, false, false],
  originalgradients: ["#563d7c", "#0071bc", "#4A9301", "#e5005d"],
  alert:"",
  steps: 5,
  finishedgradient: [
    {
      rgb: [ 86, 61, 125 ],
      cmyk: [ 31, 51, 0, 51 ],
      hsv: [ 264, 51, 49 ],
      hex: '#563D7C'
    },
    {
      rgb: [ 135, 55, 116 ],
      cmyk: [ 0, 59, 14, 47 ],
      hsv: [ 314, 59, 53 ],
      hex: '#873774'
    },
    {
      rgb: [ 145, 54, 48 ],
      cmyk: [ 0, 63, 67, 43 ],
      hsv: [ 4, 67, 57 ],
      hex: '#913630'
    },
    {
      rgb: [ 156, 143, 39 ],
      cmyk: [ 0, 8, 75, 39 ],
      hsv: [ 54, 75, 61 ],
      hex: '#9C9026'
    },
    {
      rgb: [ 65, 166, 27 ],
      cmyk: [ 61, 0, 84, 35 ],
      hsv: [ 104, 84, 65 ],
      hex: '#41A71B'
    },
    {
      rgb: [ 14, 179, 107 ],
      cmyk: [ 92, 0, 40, 30 ],
      hsv: [ 154, 92, 70 ],
      hex: '#0FB16B'
    },
    {
      rgb: [ 0, 113, 189 ],
      cmyk: [ 100, 40, 0, 26 ],
      hsv: [ 204, 100, 74 ],
      hex: '#0071BC'
    }
    ]
}
///create array
//////////////////////////////////// GET ///////////////////////////////////
router.get("/", function(req,res) {
  res.render("home", {originalgradients:data.originalgradients , gradients: data.finishedgradient,
    checkmarks: data.checkmarks, alert: data.alert, steps: data.steps})
});

router.get("/about", function(req,res) {
  res.render("about")
});
//////////////////////////////////// POST ///////////////////////////////////
router.post("/", function(req, res){
  var color1 = req.body.color1
  var colorCheck1 = req.body.colorCheck1
  var color2 = req.body.color2
  var colorCheck2 = req.body.colorCheck2
  var color3 = req.body.color3
  var colorCheck3 = req.body.colorCheck3
  var color4 = req.body.color4
  var colorCheck4 = req.body.colorCheck4

  data.steps = req.body.steps
  data.originalgradients[0] = color1
  data.originalgradients[1] = color2
  data.originalgradients[2] = color3
  data.originalgradients[3] = color4
  //save check data
  if (colorCheck1) {
    data.checkmarks[0] = true
  } else {
    data.checkmarks[0] = false
  }
  if (colorCheck2) {
    data.checkmarks[1] = true
  } else {
    data.checkmarks[1] = false
  }
  if (colorCheck3) {
    data.checkmarks[2] = true
  } else {
    data.checkmarks[2] = false
  }
  if (colorCheck4) {
    data.checkmarks[3] = true
  } else {
    data.checkmarks[3] = false
  }

  if (data.checkmarks.filter(value => value == true).length < 2) {
    data.alert = "Enable at least two colors"
  } else {
    data.alert=""
    getGradient(data.originalgradients, data.checkmarks, req.body.steps)
  }

  res.redirect("/#color-gradients")

})


//////////////////////////////////// FORMULA ///////////////////////////////////
function getGradient(gradientarray, checkmarkarray, steps){
  var count = checkmarkarray.filter(value => value == true).length
  var totalsteps = (parseInt(steps)*(parseInt(count)-1))  + parseInt(count)
  var newgradientarray = []
  count = 0
  checkmarkarray.forEach(checkmark => {
    if (checkmark) {
      newgradientarray.push(gradientarray[count])
    }
    count += 1
  })

  var grad = tinygradient(newgradientarray);
  var colors = grad.hsv(totalsteps)
  var temparray = []
  colors.forEach(color => {
      var r = color._r
      var g = color._g
      var b = color._b
      var rgb = [r,g,b]
      var cmyk = convert.rgb.cmyk(r, g, b);
      rgb = convert.cmyk.rgb(cmyk)
      var hsv = convert.rgb.hsv(r, g, b);
      var hex = "#" + convert.rgb.hex(r,g,b)
      var tempdata = {rgb: rgb, cmyk: cmyk, hsv: hsv, hex:hex}
      temparray.push(tempdata)
  })
  data.finishedgradient = temparray
}
////////////////

module.exports = router

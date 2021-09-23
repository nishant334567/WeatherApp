const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const ejs = require("hbs");
const { urlencoded } = require("body-parser");
const app = express();

require("dotenv").config();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.sendFile("index.html");
});

app.post("/", (req, res) => {
  let city = req.body.city;
  console.log(process.env.apiKey);
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${process.env.apiKey}`;
  request(url, function (err, response, body) {
    if (err) {
      alert("No such city exists");
      res.redirect("/");
      //   res.render('index',{weather:null,error:'Error, please try again'})
    } else {
      let weather = JSON.parse(body);
      if (weather.message === "city not found") {
        console.log("No such city exists");
        return res.redirect("/");
      }
      //   console.log(weather);
      //   let weatherTemp = weather.main.temp;
      let weatherIcon = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`;
      let toFar = function (weatherTemp) {
        let x = (weatherTemp * 9) / 5 + 32;
        console.log(x);
        x = Math.round((x + Number.EPSILON) * 100) / 100;
        return x;
      };
      let far = toFar(weather.main.temp);
      let min_far = toFar(weather.main.temp_min);
      let max_far = toFar(weather.main.temp_max);
      let feels_like = toFar(weather.main.feels_like);
      res.render("index", {
        weather,
        weatherIcon,
        far,
        min_far,
        max_far,
        feels_like,
      });
      /* console.log(weather);
          if(weather.main===undefined){
            res.render('index', { weather: null, error: 'Error, please try again' });
          }else{

          } */
    }
  });
});

app.listen(PORT);

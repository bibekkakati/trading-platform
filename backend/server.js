var express = require("express");
var app = express();
var bodyParser = require("body-parser");
const puppeteer = require("puppeteer");
var cors = require("cors");
var request = require("request");
var base_url = "https://ant.aliceblueonline.com";

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get("/", (req, res) => {
  res.send("<h1>Server is running.</h1>");
});

app.post("/login", (req, res) => {
  var client_id = req.body.client_id;
  var client_secret = req.body.client_secret;
  var state = "apitradingaliceblue";
  var password = req.body.password;
  var twofa = req.body.twofa;
  var url = `${base_url}/oauth2/auth?response_type=code&grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=https%3A%2F%2Fant.aliceblueonline.com%2Fplugin%2Fcallback&state=${state}`;
  var code = "";
  var base64encodedData = Buffer.from(client_id + ":" + client_secret).toString(
    "base64"
  );
  (async () => {
    try {
      var anyError = false;
      const browser = await puppeteer.launch({ headless: true });
      const page = await browser.newPage();
      await page.goto(url);
      await setTimeout(async () => {
        let urlbody = getUrlVars(page.url());
        if (urlbody.error) {
          setTimeout(async () => {
            await browser.close();
          }, 10);
          res.send({
            type: "error",
            msg: urlbody.error,
          });
          return;
        }
        await page.type("input[name=client_id]", client_id);
        await page.type("input[name=password]", password);
        await Promise.all([
          page.waitForNavigation(), // The promise resolves after navigation has finished
          page.click("button[type=submit]"), // Clicking the link will indirectly cause a navigation
        ]);
        anyError = await errorCheck(page);
        if (!anyError) {
          await page.type("input[name=answer1]", twofa);
          await page.type("input[name=answer2]", twofa);
          await Promise.all([
            page.waitForNavigation(),
            page.click("button[type=submit]"),
          ]);
          anyError = await errorCheck(page);
          if (!anyError) {
            code = getUrlVars(page.url());
            code = code.code;
          }
        }
        setTimeout(async () => {
          await browser.close();
        }, 10);
        if (anyError) {
          res.send({
            type: "error",
            msg: anyError,
          });
        } else {
          var options = {
            method: "POST",
            url: `${base_url}/oauth2/token`,
            headers: {
              "content-type": "application/x-www-form-urlencoded",
              Authorization: "Basic " + base64encodedData,
            },
            form: {
              grant_type: "authorization_code",
              code: code,
              redirect_uri: "https://ant.aliceblueonline.com/plugin/callback",
            },
          };
          request(options, function (error, response, body) {
            if (error) {
              res.send({
                type: "error",
                msg: "Couldn't fetch access token.",
              });
            } else {
              let body = JSON.parse(response.body);
              if (body.access_token) {
                res.send({ type: "data", ...body });
              } else {
                res.send({
                  type: "error",
                  msg: body.error,
                });
              }
            }
          });
        }
      }, 5500);
    } catch (error) {
      console.log(error);
      res.send({
        type: "error",
        msg: "Login automation failed",
      });
    }
  })();
});

getUrlVars = (url) => {
  var vars = {};
  var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
};

errorCheck = async (page) => {
  try {
    await page.waitForSelector(".error", { timeout: 100 });
    const error = await page.evaluate(
      () => document.querySelector(".error").innerText
    );
    return error;
  } catch (err) {
    return false;
  }
};

app.listen(8080, () => console.log("running"));

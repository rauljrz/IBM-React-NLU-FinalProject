const express = require('express');
const dotenv = require('dotenv');
dotenv.config();
const app = new express();

app.use(express.static('client'))

const cors_app = require('cors');
app.use(cors_app());
app.use(express.json());

function getNLUInstance() {
    let api_key = process.env.API_KEY
    let api_url = process.env.API_URL
    const NaturalLanguageUnderstandingV1 = require('ibm-watson/natural-language-understanding/v1');
    const { IamAuthenticator } = require('ibm-watson/auth');
    const naturalLanguageUnderstanding = new NaturalLanguageUnderstandingV1({
        version: '2021-03-25',
        authenticator: new IamAuthenticator({
            apikey: api_key,
        }),
        serviceUrl: api_url,
    });
    return naturalLanguageUnderstanding
}

app.get("/", (req, res) => {
    res.render('index.html')
});

app.get("/url/emotion", async (req, res) => {
    const natural = getNLUInstance()
    const resp = await natural.analyze({
        url: req.query.url,
        features: {
            emotion: {}
        }
    })
    return res.send(resp.result.emotion.document.emotion)
});

app.get("/url/sentiment", async (req, res) => {
    const natural = getNLUInstance()
    const resp = await natural.analyze({
        url: req.query.url,
        features: {
            sentiment: {}
        }
    })
    return res.send(resp.result.sentiment.document.label)
});

app.get("/text/emotion", async (req, res) => {
    const natural = getNLUInstance()
    const resp = await natural.analyze({
        text: req.query.text,
        features: {
            emotion: {}
        }
    })
    return res.send(resp.result.emotion.document.emotion)
});

app.get("/text/sentiment", async (req, res) => {
    const natural = getNLUInstance()
    const resp = await natural.analyze({
        text: req.query.text,
        features: {
            sentiment: {}
        }
    })
    return res.send(resp.result.sentiment.document.label)
});

let server = app.listen(8080, () => {
    console.log('Listening', server.address().port)
})
const express = require('express')
const bodyParser = require("body-parser")
const mailchimp = require("@mailchimp/mailchimp_marketing");

const app = express()
const port = 3000

app.use(express.static("public"))
app.use(bodyParser.urlencoded({ extended: true }))

app.get('/', (req, res) =>
    res.sendFile(__dirname + '/signup.html')
)

app.post('/', (req, res) => {
    const subscriberData = {
        email_address: req.body.userEmail,
        status: "subscribed",
        merge_fields: {
            FNAME: req.body.userFirstName,
            LNAME: req.body.userLastName
        }
    }
    const apiKey = "1a793601dc1b96eddf34079376a34953-us21"
    const mcServer = "us21"
    const list_id = "9892664fcb"

    mailchimp.setConfig({
        apiKey: apiKey,
        server: mcServer,
    });

    const runMailchimp = async (method) => {
        const response = await mailchimp.lists[method](
            list_id,
            subscriberData
        );
        res.send("Subscribed")
        console.log(response)
    };

    runMailchimp("addListMember").catch(err => {
        if (err.response.body.title === "Member Exists") {
            const setListMember = async () => {
                const response = await mailchimp.lists.setListMember(
                    list_id,
                    subscriberData.email_address,
                    subscriberData
                );
                res.send(`${err.response.body.title}, information updated.`)
                console.log('\x1b[36m%s\x1b[0m', `${response.email_address} - ${err.response.body.title}, updated contact information}`)
            };
            setListMember().catch(err => {
                console.log(err)
                res.send("There was a problem subscribing. Please try again later.")
            });
        } else {
            console.log(err)
        }
    });
})

app.listen(process.env.PORT || port, () =>
    // console.log('\x1b[44m%s\x1b[0m', `Listening on port ${port}`)
    console.log('\x1b[44m%s\x1b[0m', `Server Running...`)

)
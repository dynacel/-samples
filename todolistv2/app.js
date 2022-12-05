const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require('mongoose')
const date = require(__dirname + "/date.js");
const dbConnect = require(__dirname + '/dbConnect')

// Start Express Server
const app = express();
const port = 3000;

// Configure Express
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

// Connect to database
dbConnect.connectMongoose()

// Configurate database schemas and models
const itemsSchema = {
  name: { type: String, required: true, }
}
const listSchema = {
  name: { type: String, required: true, unique: true },
  items: [itemsSchema]
}
const Item = mongoose.model('Item', itemsSchema)
const List = mongoose.model('List', listSchema)

// Global Constants
const defaultItems = [{ name: "Buy food" }, { name: "Cook food" }, { name: "Eat food" }]


// Get Routes
app.get("/", (req, res) => {
  Item.find({}, (err, items) => {
    if (err) {
      console.log(err.message)
    } else {
      res.render("list", {
        listTitle: date.weekday(req),
        year: date.year(req),
        newListItems: items,
      });
    }
  });
});

app.get("/:customList", function (req, res) {
  const customListName = req.params.customList

  List.findOne({ name: customListName }, function (err, foundList) {
    if (!err) {
      if (!foundList) {
        const list = new List({
          name: customListName,
          items: []
        });
        list.save();
        console.log(`Created custom list "${customListName}"`)
        res.redirect(`/${customListName}`);
      } else {
        res.render("list", {
          listTitle: foundList.name,
          year: date.year(req),
          newListItems: foundList.items
        });
      }
    }
  });
});

app.get("/about", (req, res) => {
  res.render("about");
});

// Post Routes
app.post("/add", async (req, res) => {
  const item = req.body.addItem;
  const listTitle = req.body.title;
  const newItem = new Item({ name: item })
  console.log(req.body)

  if (listTitle === date.weekday(req)) {
    newItem
      .save((err) => {
        if (err) {
          console.log(err.message)
        }
        else {
          console.log(`Successfully added "${newItem.name}" to ${listTitle} list.`)
        }
      })
    res.redirect("/");
  } else {
    List.findOne({ name: listTitle }, (err, foundList) => {
      foundList.items.push(newItem)
      foundList
        .save((err) => { //
          if (err) {
            console.log(err.message)
          }
          else {
            console.log(`Successfully added "${newItem.name}" to ${listTitle} list.`)
          }
        })
    })
    res.redirect(`/${listTitle}`);
  }
});

app.post("/delete", (req, res) => {
  const listTitle = req.body.listTitle
  const itemId = req.body.checkbox

  if (listTitle === date.weekday(req)) {
    console.log(listTitle)
    Item.findByIdAndRemove({ _id: itemId }, (err) => {
      if (err) {
        console.log(err)
      } else {
        console.log(`Successfully deleted ${itemId}`)
      }
    })
    res.redirect("/")
  } else {
    List.findOneAndUpdate({ name: listTitle }, { $pull: { items: { _id: itemId } } }, (err, result) => {
      if (!err) {
        console.log(`Successfully deleted ${itemId}`)
        res.redirect(`/${listTitle}`)
      }
    });
  }
})

app.listen(port, () => {
  console.log('\x1b[42m%s\x1b[0m', `Server started on port ${port}`);
});
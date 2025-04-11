// 01b5b73d-419b-495d-913e-1a84d8af296f 
const axios = require("axios")
const fs = require("fs")

async function getData(levels){
    let vocab_by_id = JSON.parse(fs.readFileSync("./vocab_by_id.json"))
    let vocab_by_level = JSON.parse(fs.readFileSync("./vocab_by_level.json"))
    let vocab_by_name = JSON.parse(fs.readFileSync("./vocab_by_name.json"))

    console.log("Calling...")

    for(let i = 0; i<levels.length; ++i){
        let response = await axios({
            method:"get",
            url:`https://api.wanikani.com/v2/subjects?types=vocabulary&levels=${levels[i]}`,
            headers: {
                "Authorization": "Bearer 01b5b73d-419b-495d-913e-1a84d8af296f"
            }
        })
        let items = response.data.data
        vocab_by_level[levels[i].toString()] = items
        items.forEach(element => {
            vocab_by_id[element.id] = element
            vocab_by_name[element.data.characters] = element
        });
    }

    fs.writeFileSync("./vocab_by_id.json", JSON.stringify(vocab_by_id))
    fs.writeFileSync("./vocab_by_level.json", JSON.stringify(vocab_by_level))
    fs.writeFileSync("./vocab_by_name.json", JSON.stringify(vocab_by_name))
    console.log("Done.")
}

getData([17,18,19])
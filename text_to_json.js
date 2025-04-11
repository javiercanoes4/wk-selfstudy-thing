const fs = require('fs');
const readline = require('readline');

async function processLineByLine() {
    const fileStream = fs.createReadStream('WK.txt');

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });
    // Note: we use the crlfDelay option to recognize all instances of CR LF
    // ('\r\n') in input.txt as a single line break.

    var json_data = {}
    var current_level = 0
    var added = []
    for await (const line of rl) {
        // Each line in input.txt will be successively available here as `line`.
        if (line[line.length - 1] == ":") {
            current_level = line.slice(line.length - 3, line.length - 1)
            json_data[current_level] = []
        }
        else if (line.length > 0) {
            if (!added.includes(line.slice(4, line.length))) {
                added.push(line.slice(4, line.length))
                json_data[current_level].push({
                    "word": line.slice(4, line.length),
                    "answers": []
                })
            }

        }
    }
    // console.log(json_data)
    fs.writeFileSync("./words.json", JSON.stringify(json_data))
}

processLineByLine();
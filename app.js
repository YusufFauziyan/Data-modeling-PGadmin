const express = require('express')
const app = express()
const port = 5000

const db = require('./connection/db')

// set view engine hbs
app.set ('view engine', 'hbs')
// set public path/folder
app.use('/public', express.static(__dirname + '/public')) 

app.use(express.urlencoded({extended: false}))


app.get ('/', (req, res) => {

        db.connect((err, client, done) => {
        if (err) throw err

        client.query('SELECT * FROM tb_projects', (err, result) => {
            if (err) throw err
            let data = result.rows
            
            data = data.map(function (item) {
                return {
                    title: item.title,
                    description: item.description.slice(0, 150) + '.....',
                    author: item.author,
                    sDate: item.sDate,
                    eDate: item.eDate,
                    duration: abtDuration(item.sDate, item.eDate),
                    techjs: item.techjs,
                    techreact: item.techreact,
                    technode: item.technode,
                    techvue: item.techvue
                }
            })
            
            res.render('index', { blogs: data })
        })
    })
})

app.get ('/contact', (req, res) =>{
    res.render('contact', {title: 'Halaman contact'})
})

app.get ('/add-project', (req, res) =>{

    res.render('add-project', {title: 'Halaman AddProject'})
})

app.get ('/blog', (req, res) =>{
    res.render('blog', {title: 'Halaman Blog'})
})

app.get ('/update-project', (req, res) =>{
    res.render('update-project', {title: 'Halaman Project'})
})

app.get ('/add-my-project', (req, res) =>{
    res.render('add-my-project', {title: 'Halaman AddMyProject'})
})

app.use ('/', (req, res) => {
    res.status(404)
    res.send('<h1>404</h1>')
})

function abtDuration(startDate, endDate) {
    let start = new Date(startDate);
    let end = new Date(endDate);
    let duration = end.getTime() - start.getTime();
    let year = Math.floor(duration / (1000 * 3600 * 24 * 30 * 12))
    let month = Math.round(duration / (1000 * 3600 * 24 * 30));
    let day = duration / (1000 * 3600 * 24)
  
    if (day < 30) {
        return day + ' Hari';
    } else if (month < 12) {
        return month + ' Bulan';
    } else {
        return year + ' Tahun'
    }

}

app.listen(port, () =>{
    console.log(`Server listen at http://localhost: ${port}`)
})
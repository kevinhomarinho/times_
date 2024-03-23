const express = require("express");
const app = express();
const handlebars = require("express-handlebars");
const bodyParser = require("body-parser");
const Post = require("./models/post");
//carregando o cabeçalho do html em outras páginas
app.engine("handlebars", handlebars.engine({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//rota para alterar
app.get("/alterar/:id", function (req, res) {
  Post.findAll({ where: { id: req.params.id } }).then(function (posts) {
    //var nposts = JSON.parse(JSON.stringfy(posts))
    //res.render('home),{posts:nposts}
    posts = posts.map((post) => {
      return post.toJSON();
    });
    res.render("alterar", { posts: posts });
  });
});

//alterando no banco
app.post("/update", function (req, res) {
  Post.update(
    {
      nome: req.body.nome,
      estado: req.body.estado,
      torcidas: req.body.torcidas,
      nota: req.body.nota,
    },
    { where: { id: req.body.id } }
  )
    .then(function () {
      res.redirect("/");
    })
    .catch(function (erro) {
      res.send("Esta postagem não existe");
    });
});
//arquivos estáticos usando o bottstrap

app.use("/public", express.static("public/css/bootstrap"));

app.use("/img", express.static("public/img"))
//rota principal
app.get("/", function (req, res) {
  Post.findAll().then(function (posts) {
    posts = posts.map((post) => {
      const postjson = post.toJSON();
      return {
        ...postjson,
        createdAt: new Date(postjson.createdAt)
          .toISOString()
          .replace(/T/, " ")
          .replace(/\..+/, ""),
      };
    });
    res.render("home", { posts: posts });
  });
});
//rota de cadastro
app.get("/cad", function (req, res) {
  res.render("formulario");
});
//Tela depois que deletar
app.get("/cad", function (req, res) {
  res.render("formulario");
});
//Rota pro mário
app.get("/deletado", function (req, res) {
  res.render("deletado");
});
//Exlusao de dados
app.get("/deletar/:id", function (req, res) {
  Post.destroy({ where: { id: req.params.id } })
    .then(function () {
      res.redirect("/");
    })
    .catch(function (erro) {
      res.send("Está postagem não existe");
    });
});

//fazendo a inserção no bd
app.post("/add", function (req, res) {
  console.log(req.body);
  Post.create({
    nome: req.body.nome,
    estado: req.body.estado,
    torcidas: req.body.torcidas,
    nota:req.body.nota,
  })
    .then(function () {
      //redirecionando para home com o barra
      res.redirect("/");
    })
    .catch(function (erro) {
      res.send('"Houve um erro: ' + erro);
    });
});
app.listen(8081, function () {
  console.log("Servidor Rodando em https://localhost:8081 ");
});

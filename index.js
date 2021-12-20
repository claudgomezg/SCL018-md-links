import fetch from "node-fetch";
import fs from "fs";
import path from "path";
import Yargs from "yargs";

const userPath = process.argv[2]; //El número 2 lee el README o la ruta a ocupar
const option = Yargs(process.argv.slice(2)).argv; // 

const isMd = (fileReader) => {
  const extension = path.extname(fileReader.toLowerCase()); //extname, extrae la extensión del archivo
  if(fileReader === undefined){
    console.log("El archivo está indefinido.")
  }
  else if(extension === ".md"){
    return readData(fileReader)
  }
  else{
    console.log("La extensión está errónea.")
  }
}

const readData = (file) => {
  try {
    if (fs.existsSync(file)) {
      const data = fs.readFileSync(file, {
        encoding: "utf8",
        flag: "r",
      });
      return readLinks(data);
    }
  } catch (err) {
    console.log(err);
  }
}

//leer links
const readLinks = (file) => {
  const regEx = /\[([^\]]+)]\((https?:\/\/[^\s)]+)\)/g; //Expresión regular, busca las coincidencias del link
  let links = [];
  const matchLinks = file.matchAll(regEx); //matchAll retorna el iterador del resultado (la cadena)
  for(const match of matchLinks){ //El match itera en cada elemento, busca las coincidencias
    const data = {
      text: match[1], // texto del link
      href: match[2], // link
      file: userPath, 
    }
    links.push(data);  //sube los links por cada iteración
  }
  return links;
}

//validación de links
const validateLinks = (links) =>{
  let validated = links.map((link) => //devuelve array nueva, buscar info sobre map
    fetch(link.href).then((response)=> {
      return {
        text: link.text,
        href: link.href,
        file: link.file,
        status: response.status,
        statusText: response.statusText,
      };
    })
  );
  return Promise.all(validated);  //funciona sólo con arreglos.
};

//función principal
const validate = true;
const MDLinks = (fileToRead) => {
  return new Promise((resolve, reject) => {
    const links = isMd(fileToRead);
    if(option.validate){
      resolve(validateLinks(links))
    }
    else{
      resolve(links);
    }
    reject();
  });
};

MDLinks(userPath).then((results) =>
console.log(results));

// console.log(isMd(userPath));














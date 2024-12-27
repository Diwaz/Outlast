package main

import (
	"log"
	"net/http"
)

func main() {
	setupAPI()
	log.Fatal(http.ListenAndServe(":8000", nil))
}

func setupAPI() {
	http.Handle("/", http.FileServer(http.Dir("./web/dist")))
	//serve map json
	http.Handle("/src/", http.StripPrefix("/src/", http.FileServer(http.Dir("./web/src"))))
}
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
	// manager := newManager()
	// room := newRoom()
	http.Handle("/", http.FileServer(http.Dir("./web/dist")))

	http.HandleFunc("/create-room", handleCreateRoom)

	http.HandleFunc("/ws", handleWS)
	//serve map json
	http.Handle("/src/", http.StripPrefix("/src/", http.FileServer(http.Dir("./web/src"))))
	// http.HandleFunc("/ws", manager.serveWs)
}

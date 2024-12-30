package main

import (
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

type Room struct {
	code string
	// id string
	players    map[*Client]bool
	joinable   bool
	p1Roomchan chan []byte
	p2Roomchan chan []byte
	sync.Mutex
}

var (
	wsUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
	}
)

func generateInviteCode() string {
	const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	code := make([]byte, 6)
	for i := range code {
		code[i] = charset[rand.Intn(len(charset))]
	}
	return string(code)
}

func newRoom() *Room {

	code := generateInviteCode()
	return &Room{
		code:       code,
		joinable:   true,
		p1Roomchan: make(chan []byte),
		p2Roomchan: make(chan []byte),
		players:    make(map[*Client]bool),
	}
}
func (room *Room) handleRoom(w http.ResponseWriter, r *http.Request) {
	log.Println("creating room .....")
	conn, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	client := newClient(conn, room)

	room.addPlayer(client)
	// m.addClient(client)
	// room.registerPlayer(client)
	go client.readMessage()
	go client.writeMessage()
	// code := generateInviteCode()
	// room := newRoom(code)

	// room.players[player] = true
	fmt.Printf("room created with code %s \n", room.code)
	// return room

}

// func (r *Room) handleCreateRoom(player *Client) *Room {
// 	code := generateInviteCode()
// 	room := newRoom(code)

// 	room.players[player] = true
// 	fmt.Println("room created with code %s \n", code)
// 	return room

// }

// func (r *Room) registerPlayer(c *Client) {
// 	fmt.Println("player registered")
// 	r.players[c] = true
// }

// func (r *Room) unregisterPlayer(c *Client) {
// 	if _, ok := r.players[c]; ok {
// 		delete(r.players, c)
// 	}
// }

func (r *Room) addPlayer(client *Client) {
	r.Lock()
	defer r.Unlock()

	r.players[client] = true
}

func (r *Room) removePlayer(client *Client) {
	r.Lock()
	defer r.Unlock()

	if _, ok := r.players[client]; ok {
		client.connection.Close()
		delete(r.players, client)
	}
}

package main

import (
	"encoding/json"
	"fmt"
	"log"
	"math/rand"
	"net/http"
	"sync"
	"time"

	"github.com/gorilla/websocket"
)

type Room struct {
	code string
	// id string
	players     map[string]*Client
	joinable    bool
	totalPlayer int
	// p1Roomchan  chan []byte
	// p2Roomchan  chan []byte
	mutex sync.Mutex
}
type GameMessage struct {
	Type     string `json:"type"`
	PlayerID string `json:"playerId"`
	RoomID   string `json:"roomId"`
	Data     string `json:"Data"`
}
type RoomList map[string]*Room

var (
	gameRooms  = make(map[string]*Room)
	roomsMutex sync.Mutex
	wsUpgrader = websocket.Upgrader{
		ReadBufferSize:  1024,
		WriteBufferSize: 1024,
		CheckOrigin: func(r *http.Request) bool {
			return true // DONT DO THIS IN PROD
		},
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

// func newRoom(code string) *Room {

//		return &Room{
//			code:       code,
//			joinable:   true,
//			p1Roomchan: make(chan []byte),
//			p2Roomchan: make(chan []byte),
//			players:    make(map[string]*Client),
//		}
//	}
func handleCreateRoom(w http.ResponseWriter, r *http.Request) {

	code := generateInviteCode()
	log.Println("creating room .....")
	roomsMutex.Lock()
	gameRooms[code] = &Room{
		code:    code,
		players: make(map[string]*Client),
	}
	roomsMutex.Unlock()
	// return JSON
	w.Header().Set("Content Type", "application/json")
	json.NewEncoder(w).Encode(map[string]string{
		"roomId": code,
	})
}
func handleWS(w http.ResponseWriter, r *http.Request) {
	conn, err := wsUpgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}
	playerID := fmt.Sprintf("player_%d", time.Now().UnixNano())
	code := r.URL.Query().Get("roomId")

	roomsMutex.Lock()
	room, exists := gameRooms[code]
	if !exists {
		roomsMutex.Unlock()
		conn.WriteJSON(GameMessage{
			Type: "error",
			Data: "Room not found",
		})
		conn.Close()
		return
	}

	if room.totalPlayer >= 2 {
		roomsMutex.Unlock()
		conn.WriteJSON(GameMessage{
			Type: "error",
			Data: "Room is full",
		})
		conn.Close()
		return
	}

	player := &Client{
		ID:         playerID,
		connection: conn,
		room:       room,
	}

	room.players[playerID] = player
	room.totalPlayer++
	roomsMutex.Unlock()

	// Notify all players in the room about the new player
	broadcastToRoom(room, GameMessage{
		Type:     "player_joined",
		PlayerID: playerID,
		RoomID:   code,
	})

	// Start game if room is full
	if room.totalPlayer == 2 {
		room.joinable = false
		broadcastToRoom(room, GameMessage{
			Type: "game_start",
			Data: "Game is starting",
		})
	}

	// Handle incoming messages
	handlePlayerMessages(player)
}

// handlePlayerMessages processes incoming messages from a player
func handlePlayerMessages(player *Client) {
	for {
		var message GameMessage
		err := player.connection.ReadJSON(&message)
		if err != nil {
			handlePlayerDisconnect(player)
			return
		}

		switch message.Type {
		case "position_update":
			// Broadcast position update to other player
			broadcastToOthers(player, message)
		case "player_action":
			// Broadcast player action to other player
			broadcastToOthers(player, message)
		}
	}
}

// broadcastToRoom sends a message to all players in a room
func broadcastToRoom(room *Room, message GameMessage) {
	room.mutex.Lock()
	defer room.mutex.Unlock()

	for _, player := range room.players {
		player.connection.WriteJSON(message)
	}
}

// broadcastToOthers sends a message to all other players in the room
func broadcastToOthers(sender *Client, message GameMessage) {
	sender.room.mutex.Lock()
	defer sender.room.mutex.Unlock()

	for _, player := range sender.room.players {
		if player.ID != sender.ID {
			player.connection.WriteJSON(message)
		}
	}
}

// handlePlayerDisconnect manages player disconnection
func handlePlayerDisconnect(player *Client) {
	room := player.room
	room.mutex.Lock()
	delete(room.players, player.ID)
	room.totalPlayer--

	// Notify remaining player about disconnection
	broadcastToRoom(room, GameMessage{
		Type:     "player_disconnected",
		PlayerID: player.ID,
	})

	// Clean up empty rooms
	if room.totalPlayer == 0 {
		roomsMutex.Lock()
		delete(gameRooms, room.code)
		roomsMutex.Unlock()
	}
	room.mutex.Unlock()

	player.connection.Close()
}

// while creating a new client the 3rd param is true bcz this client creates room
// client := newClient(conn, room, true)
// room.isp1=true
// room.addPlayer(client)
// m.addClient(client)
// room.registerPlayer(client)
// go client.readMessage()
// go client.writeMessage()
// code := generateInviteCode()
// room := newRoom(code)

// room.players[player] = true
// fmt.Printf("room created with code %s \n", room.code)

// func (room *Room) handleJoinRoom(w http.ResponseWriter, r *http.Request) {
// 	log.Println("Joining Room .....")
// 	conn, err := wsUpgrader.Upgrade(w, r, nil)
// 	if err != nil {
// 		log.Println(err)
// 		return
// 	}
// 	// while creating a new client the 3rd param is true bcz this client creates room
// 	client := newClient(conn, room, false)
// 	// room.isp1=true
// 	room.addPlayer(client)
// 	// m.addClient(client)
// 	// room.registerPlayer(client)
// 	go client.readMessage()
// 	go client.writeMessage()
// 	// code := generateInviteCode()
// 	// room := newRoom(code)

// 	// room.players[player] = true

// }

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

// func (r *Room) addPlayer(client *Client) {
// 	r.Lock()
// 	defer r.Unlock()

// 	// r.players[client] = true
// }

// func (r *Room) removePlayer(client *Client) {
// 	r.Lock()
// 	defer r.Unlock()

// 	// if _, ok := r.players[client]; ok {
// 	// 	client.connection.Close()
// 	// 	delete(r.players, client)
// 	// }
// }

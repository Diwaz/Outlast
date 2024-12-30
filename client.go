package main

import (
	"encoding/json"
	"fmt"
	"log"
	"time"

	"github.com/gorilla/websocket"
)

type ClientList map[*Client]bool

type Client struct {
	connection *websocket.Conn
	room       *Room
	// manager    *Manager
	egress chan []byte
}

func newClient(conn *websocket.Conn, room *Room) *Client {
	return &Client{
		connection: conn,
		// manager:    manager,
		egress: make(chan []byte),
		room:   room,
	}

}
func broadcastMovement(c *Client) {
	ticker := time.NewTicker(500 * time.Millisecond)
	defer ticker.Stop()

	x := 0
	y := 0

	for range ticker.C {
		payload := map[string]int{
			"x": x,
			"y": y,
		}

		jsonPayload, err := json.Marshal(payload)
		if err != nil {
			fmt.Println("Error Marshling JSON", err)
			continue
		}

		for wsclient := range c.room.players {
			select {
			case wsclient.egress <- jsonPayload:
				fmt.Println("sent")
			default:
				fmt.Println("Client egress channel is blocked")
			}
		}
		x += 5
	}
}
func (c *Client) readMessage() {
	defer func() {

		c.room.removePlayer(c)
	}()

	for {

		messageType, payload, err := c.connection.ReadMessage()

		if err != nil {

			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error reading  message : %v", err)
			}
			break // break the loop to close conn & cleanup
		}

		log.Println("MessageType: ", messageType)
		log.Println("Payload: ", string(payload))

		broadcastMovement(c)
		// for wsclient := range c.manager.clients {
		// 	// wsclient.egress <- payload

		// }
	}
}

func (c *Client) writeMessage() {
	defer func() {

		c.room.removePlayer(c)
	}()

	for {
		log.Println("hello")
		select {
		case message, ok := <-c.egress:

			if !ok {
				if err := c.connection.WriteMessage(websocket.CloseMessage, nil); err != nil {
					log.Println("connection closed", err)
				}
				return
			}

			if err := c.connection.WriteMessage(websocket.TextMessage, message); err != nil {
				log.Println(err)
			}
			log.Println("messafe sent")

		}
	}

}

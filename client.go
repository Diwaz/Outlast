package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type ClientList map[*Client]bool

type Client struct {
	connection *websocket.Conn

	manager *Manager
}

func newClient(conn *websocket.Conn, manager *Manager) *Client {
	return &Client{
		connection: conn,
		manager:    manager,
	}

}

func (c *Client) readMessage() {
	defer func() {

		c.manager.removeCient(c)
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

	}
}

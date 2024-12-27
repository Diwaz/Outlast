package main

import (
	"log"

	"github.com/gorilla/websocket"
)

type ClientList map[*Client]bool

type Client struct {
	connection *websocket.Conn

	manager *Manager
	egress  chan []byte
}

func newClient(conn *websocket.Conn, manager *Manager) *Client {
	return &Client{
		connection: conn,
		manager:    manager,
		egress:     make(chan []byte),
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

		for wsclient := range c.manager.clients {
			wsclient.egress <- payload
		}
	}
}

func (c *Client) writeMessage() {
	defer func() {

		c.manager.removeCient(c)
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

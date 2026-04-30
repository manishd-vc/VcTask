import { Client as StompJsClient } from '@stomp/stompjs';
import { useEffect, useState } from 'react';

/**
 * Helper function to get a token from the cookies.
 * This function retrieves the value of a specific cookie.
 *
 * @param {string} tokenName - The name of the token to retrieve.
 * @returns {string} - The value of the specified token.
 */
function getToken(tokenName) {
  if (typeof window !== 'undefined') {
    let name = tokenName + '='; // Cookie name to search for
    let decodedCookie = decodeURIComponent(document.cookie); // Decode cookie string
    let ca = decodedCookie.split(';'); // Split cookies into an array
    for (const c of ca) {
      let trimmed = c.trim();
      if (trimmed.startsWith(name)) {
        return trimmed.substring(name.length);
      }
    }
    return ''; // Return empty if the token is not found
  }
  return ''; // Return empty if not in the browser context
}

/**
 * Custom hook to manage the WebSocket connection with STOMP.
 *
 * @returns {object} - Returns connection status, client instance, and utility functions like `sendMessage` and `subscribe`.
 */
const useWebSocket = () => {
  const [connected, setConnected] = useState(false); // State to track WebSocket connection status
  const [client, setClient] = useState(null); // State to store STOMP client instance

  useEffect(() => {
    try {
      // Only establish the connection if not already connected
      if (!connected) {
        setConnected(true); // Set to connected
        const token = getToken('userToken'); // Retrieve token from cookies
        const url = process.env.SOCKET_URL; // Get WebSocket URL from environment variable

        if (!url) {
          console.error('WebSocket URL is not defined in the environment variables.');
          return;
        }

        // Headers for WebSocket connection, including the authorization token
        const connectHeaders = {
          Authorization: `Bearer ${token}`,
          Name: 's'
        };

        // Create a new STOMP client for the WebSocket connection
        const stompClient = new StompJsClient({
          brokerURL: url,
          connectHeaders: connectHeaders,
          rejectUnauthorized: false // Set to false if using self-signed certificates
        });

        // Handle successful connection
        stompClient.onConnect = (frame) => {
          setConnected(true); // Set connected state to true
          setClient(stompClient); // Save the STOMP client instance
          console.log('Connected: ' + frame);
        };

        // Handle WebSocket connection errors
        stompClient.onWebSocketError = (error) => {
          console.error('Error with WebSocket', error);
          setConnected(false); // Set connected state to false on error
        };

        // Handle STOMP protocol errors (e.g., broker errors)
        stompClient.onStompError = (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
          setConnected(false); // Set connected state to false on error
        };

        // If not already connected, activate the client
        if (!stompClient.connected) {
          stompClient.activate();
        }

        // Save the STOMP client instance to state
        setClient(stompClient);
      }
    } catch (e) {
      console.log(e); // Log any errors during connection setup
    }
  }, [connected]); // Re-run effect when `connected` state changes

  /**
   * Function to disconnect the WebSocket client
   */
  const disconnect = () => {
    if (connected) {
      client?.deactivate(); // Deactivate the STOMP client
      setConnected(false); // Set connected state to false
    }
  };

  /**
   * Function to send a message through the WebSocket connection
   *
   * @param {string} destination - The destination where the message should be sent.
   * @param {object} messageContent - The content of the message to send.
   */
  const sendMessage = (destination, messageContent) => {
    if (connected) {
      client?.publish({
        destination,
        body: JSON.stringify(messageContent) // Send message as a JSON string
      });
    }
  };

  /**
   * Function to subscribe to a destination on the WebSocket connection
   *
   * @param {string} destination - The destination to subscribe to.
   * @param {function} callback - The function to call when a message is received.
   */
  const subscribe = (destination, callback) => {
    if (connected) {
      client?.subscribe(destination, callback); // Subscribe to destination with the callback
    }
  };

  // Return the connection status, disconnect function, sendMessage, client, and subscribe function
  return { connected, disconnect, sendMessage, client, subscribe };
};

export default useWebSocket;

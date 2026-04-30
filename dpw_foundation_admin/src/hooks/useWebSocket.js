import { Client as StompJsClient } from '@stomp/stompjs';
import { useEffect, useState } from 'react';
/**
 * Retrieves the value of a specified cookie by name.
 *
 * @param {string} tokenName - The name of the cookie to retrieve.
 * @returns {string} - The value of the cookie, or an empty string if not found.
 */
function getToken(tokenName) {
  if (typeof window !== 'undefined') {
    let name = tokenName + '=';
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (const c of ca) {
      let trimmed = c.trim();
      if (trimmed.startsWith(name)) {
        return trimmed.substring(name.length);
      }
    }
    return '';
  }
  return '';
}
const MAX_RETRIES = 5;
/**
 * Custom hook to manage a WebSocket connection using STOMP over WebSocket.
 * Provides methods to connect, disconnect, send messages, and subscribe to destinations.
 *
 * @returns {Object} - An object containing:
 *                     - `connected` {boolean}: Connection status of the WebSocket.
 *                     - `disconnect` {Function}: Function to deactivate the WebSocket.
 *                     - `sendMessage` {Function}: Function to send a message to a destination.
 *                     - `client` {StompJsClient | null}: The STOMP client instance.
 *                     - `subscribe` {Function}: Function to subscribe to a destination.
 */
const useWebSocket = () => {
  const [connected, setConnected] = useState(false); // WebSocket connection status
  const [client, setClient] = useState(null); // STOMP client instance
  const [retryCount, setRetryCount] = useState(0);
  useEffect(() => {
    attemptConnection(retryCount);
  }, []);

  const attemptConnection = (count) => {
    try {
      if (!connected && count < MAX_RETRIES) {
        setConnected(true);
        const token = getToken('adminToken');
        const url = process.env.SOCKET_URL;
        if (!url) {
          console.error('WebSocket URL is not defined in the environment variables.');
          return;
        }
        const connectHeaders = {
          Authorization: `Bearer ${token}`,
          Name: 's'
        };
        const stompClient = new StompJsClient({
          brokerURL: url,
          connectHeaders: connectHeaders,
          rejectUnauthorized: false // Allows connecting to servers with self-signed certificates
        });
        // Event handler for successful connection
        stompClient.onConnect = (frame) => {
          setConnected(true);
          setClient(stompClient);
          console.log('Connected: ' + frame);
        };
        // Event handler for WebSocket errors
        stompClient.onWebSocketError = (error) => {
          setConnected(false);
          handleRetry(); // Retry on WebSocket error
        };
        // Event handler for STOMP protocol errors
        stompClient.onStompError = (frame) => {
          console.error('Broker reported error: ' + frame.headers['message']);
          console.error('Additional details: ' + frame.body);
          setConnected(false);
          handleRetry(); // Retry on STOMP error
        };
        if (!stompClient.connected) {
          stompClient.activate(); // Activates the WebSocket connection
        }
        setClient(stompClient);
      }
    } catch (e) {
      console.error('WebSocket initialization error:', e);
      handleRetry(); // Retry on initialization error
    }
  };

  const handleRetry = () => {
    if (retryCount < MAX_RETRIES) {
      setRetryCount((prevRetryCount) => {
        const newRetryCount = prevRetryCount + 1;
        setTimeout(() => {
          attemptConnection(newRetryCount);
        }, 2000);
        return newRetryCount;
      });
    } else {
      console.error('Max retries reached. Could not connect to WebSocket.');
    }
  };

  /**
   * Disconnects the WebSocket connection.
   */
  const disconnect = () => {
    if (connected) {
      client?.deactivate();
      setConnected(false);
    }
  };

  /**
   * Sends a message to a specified destination through the WebSocket.
   *
   * @param {string} destination - The destination to send the message to.
   * @param {Object} messageContent - The message content to send.
   */
  const sendMessage = (destination, messageContent) => {
    if (connected) {
      client?.publish({
        destination,
        body: JSON.stringify(messageContent)
      });
    }
  };

  /**
   * Subscribes to a specified destination and triggers a callback on receiving a message.
   *
   * @param {string} destination - The destination to subscribe to.
   * @param {Function} callback - The callback function to execute on receiving a message.
   */
  const subscribe = (destination, callback) => {
    if (connected && client) {
      client?.subscribe(destination, callback);
    }
  };

  return { connected, disconnect, sendMessage, client, subscribe };
};

export default useWebSocket;

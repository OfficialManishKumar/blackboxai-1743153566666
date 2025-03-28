class HttpRequestNode {
  static type = 'httpRequest';
  static label = 'HTTP Request';
  static description = 'Makes an HTTP request to a specified URL';

  static defaultConfig = {
    url: '',
    method: 'GET',
    headers: {},
    body: ''
  };

  static async execute(node, inputData) {
    const { url, method, headers, body } = node.config;
    
    try {
      const response = await fetch(url, {
        method,
        headers,
        body: method !== 'GET' ? body : undefined
      });

      return {
        status: response.status,
        headers: Object.fromEntries(response.headers.entries()),
        data: await response.json()
      };
    } catch (error) {
      return {
        error: error.message,
        status: 500
      };
    }
  }
}

module.exports = HttpRequestNode;
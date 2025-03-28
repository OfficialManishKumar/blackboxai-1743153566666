class WorkflowEditor {
  constructor(options) {
    this.canvas = options.canvas;
    this.connectionLayer = options.connectionLayer;
    this.propertiesPanel = options.propertiesPanel;
    this.nodes = [];
    this.connections = [];
    this.selectedNode = null;
    
    this.initNodePalette();
    this.initEventListeners();
  }

  initNodePalette() {
    // Node types would be loaded from an API in a real implementation
    this.nodeTypes = {
      httpRequest: {
        name: 'HTTP Request',
        icon: 'fa-globe',
        color: 'border-blue-500',
        properties: {
          url: { type: 'string', default: '' },
          method: { 
            type: 'select', 
            options: ['GET', 'POST', 'PUT', 'DELETE'],
            default: 'GET'
          }
        }
      }
    };
  }

  initEventListeners() {
    // Handle node drag from palette
    document.querySelectorAll('[draggable="true"]').forEach(el => {
      el.addEventListener('dragstart', e => {
        e.dataTransfer.setData('node-type', e.target.dataset.nodeType);
      });
    });

    // Handle node drop on canvas
    this.canvas.addEventListener('dragover', e => e.preventDefault());
    this.canvas.addEventListener('drop', e => this.handleNodeDrop(e));
    
    // Handle node selection
    this.canvas.addEventListener('click', e => this.handleNodeClick(e));
  }

  handleNodeDrop(e) {
    e.preventDefault();
    const nodeType = e.dataTransfer.getData('node-type');
    const position = { x: e.clientX, y: e.clientY };
    
    this.addNode(nodeType, position);
  }

  addNode(nodeType, position) {
    const node = {
      id: `node-${Date.now()}`,
      type: nodeType,
      x: position.x - this.canvas.getBoundingClientRect().left,
      y: position.y - this.canvas.getBoundingClientRect().top,
      properties: JSON.parse(JSON.stringify(this.nodeTypes[nodeType].properties))
    };
    
    this.nodes.push(node);
    this.renderNode(node);
  }

  renderNode(node) {
    const nodeEl = document.createElement('div');
    nodeEl.className = `node absolute p-3 bg-white rounded-lg shadow cursor-move ${this.nodeTypes[node.type].color}`;
    nodeEl.style.left = `${node.x}px`;
    nodeEl.style.top = `${node.y}px`;
    nodeEl.dataset.nodeId = node.id;
    
    nodeEl.innerHTML = `
      <div class="node-header flex items-center mb-2">
        <i class="fas ${this.nodeTypes[node.type].icon} mr-2"></i>
        <span class="font-medium">${this.nodeTypes[node.type].name}</span>
      </div>
    `;
    
    this.canvas.appendChild(nodeEl);
  }

  handleNodeClick(e) {
    const nodeEl = e.target.closest('.node');
    if (nodeEl) {
      const nodeId = nodeEl.dataset.nodeId;
      this.selectNode(nodeId);
    }
  }

  selectNode(nodeId) {
    this.selectedNode = this.nodes.find(n => n.id === nodeId);
    this.renderNodeProperties();
  }

  renderNodeProperties() {
    if (!this.selectedNode) return;
    
    const nodeType = this.nodeTypes[this.selectedNode.type];
    let html = `<h3 class="font-bold mb-4">${nodeType.name} Properties</h3>`;
    
    Object.entries(this.selectedNode.properties).forEach(([key, prop]) => {
      html += this.renderPropertyField(key, prop);
    });
    
    this.propertiesPanel.innerHTML = html;
  }

  renderPropertyField(key, prop) {
    let field = '';
    switch(prop.type) {
      case 'select':
        field = `
          <select class="w-full p-2 border rounded">
            ${prop.options.map(opt => 
              `<option ${opt === prop.default ? 'selected' : ''}>${opt}</option>`
            ).join('')}
          </select>
        `;
        break;
      default:
        field = `<input type="text" class="w-full p-2 border rounded" value="${prop.default}">`;
    }
    
    return `
      <div class="mb-4">
        <label class="block text-sm font-medium mb-1">${key}</label>
        ${field}
      </div>
    `;
  }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const editor = new WorkflowEditor({
    canvas: document.getElementById('workflow-canvas'),
    connectionLayer: document.getElementById('connection-layer'),
    propertiesPanel: document.getElementById('node-properties')
  });
});
class WorkflowEngine {
  constructor() {
    this.workflows = new Map(); // In-memory workflow storage
    this.nodes = new Map();     // Registered node types
  }

  registerNodeType(nodeType, executor) {
    this.nodes.set(nodeType, executor);
  }

  createWorkflow(name) {
    const workflow = {
      id: Date.now().toString(),
      name,
      nodes: [],
      connections: []
    };
    this.workflows.set(workflow.id, workflow);
    return workflow;
  }

  addNode(workflowId, node) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');
    
    const nodeId = Date.now().toString();
    node.id = nodeId;
    workflow.nodes.push(node);
    return node;
  }

  connectNodes(workflowId, sourceNodeId, sourceOutput, targetNodeId, targetInput) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    workflow.connections.push({
      sourceNodeId,
      sourceOutput,
      targetNodeId,
      targetInput
    });
  }

  async executeWorkflow(workflowId, initialData = {}) {
    const workflow = this.workflows.get(workflowId);
    if (!workflow) throw new Error('Workflow not found');

    // Simple linear execution for now
    let currentData = initialData;
    for (const node of workflow.nodes) {
      const executor = this.nodes.get(node.type);
      if (!executor) throw new Error(`No executor for node type: ${node.type}`);
      
      currentData = await executor(node, currentData);
    }

    return currentData;
  }
}

module.exports = WorkflowEngine;
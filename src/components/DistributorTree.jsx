import React, { useState } from 'react';

function DistributorTree({ tree, distributors, trees }) {
  console.log('Tree received:', tree);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const NODE_WIDTH = 50;
  const NODE_HEIGHT = 50;
  const VERTICAL_SPACING = 30;
  const HORIZONTAL_SPACING = 150;
  const PADDING = 400;

  const toggleFullscreen = () => {
    const element = document.getElementById('tree-container');
    
    if (!document.fullscreenElement) {
      element.requestFullscreen().catch(err => {
        alert(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  // Hàm tính toán vị trí X cho mỗi node
  const calculateNodePositions = (node, level = 0, positions = new Map(), leftmost = { x: 0 }) => {
    // Kiểm tra node tồn tại và có đầy đủ thuộc tính
    if (!node || !node.id) return positions;

    // Đảm bảo node.children luôn là một mảng
    const children = node.children || [];

    const y = level * (NODE_HEIGHT + VERTICAL_SPACING);
    let x = 0;

    if (children.length === 0) {
      x = leftmost.x;
      leftmost.x += NODE_WIDTH + HORIZONTAL_SPACING;
    } else {
      // Kiểm tra tất cả children trước khi tính toán
      children.forEach(child => {
        if (child) {
          calculateNodePositions(child, level + 1, positions, leftmost);
        }
      });

      // Kiểm tra xem có positions cho children không
      const validChildren = children.filter(child => child && positions.has(child.id));
      if (validChildren.length > 0) {
        const firstChild = positions.get(validChildren[0].id);
        const lastChild = positions.get(validChildren[validChildren.length - 1].id);
        x = (firstChild.x + lastChild.x) / 2;
      } else {
        x = leftmost.x;
        leftmost.x += NODE_WIDTH + HORIZONTAL_SPACING;
      }
    }

    positions.set(node.id, { x, y });
    return positions;
  };

  const nodePositions = calculateNodePositions(tree);
  
  // Tính toán kích thước SVG dựa trên vị trí các node
  const positions = Array.from(nodePositions.values());
  const maxX = Math.max(...positions.map(pos => pos.x)) + NODE_WIDTH + HORIZONTAL_SPACING;
  const maxY = Math.max(...positions.map(pos => pos.y)) + NODE_HEIGHT + VERTICAL_SPACING;

  const renderConnections = (node) => {
    if (!node) return null;

    const results = [];
    const pos = nodePositions.get(node.id);
    const parentPos = node.parentId ? nodePositions.get(node.parentId) : null;

    if (node.parentId && parentPos && !trees.includes(node.id)) {
      results.push(
        <path
          key={`connection-${node.id}`}
          d={`M ${pos.x + NODE_WIDTH/2} ${pos.y}
              C ${pos.x + NODE_WIDTH/2} ${pos.y - VERTICAL_SPACING*0.3},
                ${parentPos.x + NODE_WIDTH/2} 
                ${parentPos.y + NODE_HEIGHT + VERTICAL_SPACING*0.3},
                ${parentPos.x + NODE_WIDTH/2} 
                ${parentPos.y + NODE_HEIGHT}`}
          stroke="#94a3b8"
          fill="none"
          strokeWidth="2"
        />
      );
    }

    // Đệ quy qua các node con
    if (node.children) {
      node.children.forEach(child => {
        const childConnections = renderConnections(child);
        if (childConnections) {
          results.push(childConnections);
        }
      });
    }

    return results;
  };

  const renderNodes = (node) => {
    if (!node) return null;

    const results = [];
    const pos = nodePositions.get(node.id);

    if (pos) {
      results.push(
        <g key={node.id}>
          <rect
            x={pos.x}
            y={pos.y}
            width={NODE_WIDTH}
            height={NODE_HEIGHT}
            rx={8}
            fill="white"
            stroke="#3b82f6"
            strokeWidth="2"
          />
          <text
            x={pos.x + NODE_WIDTH/2}
            y={pos.y + NODE_HEIGHT/2}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-sm font-medium"
          >
            {node.name}
          </text>
          <text
            x={pos.x + NODE_WIDTH/2}
            y={pos.y + NODE_HEIGHT/2 + 15}
            textAnchor="middle"
            dominantBaseline="middle"
            className="text-xs text-gray-500"
          >
            ID: {node.id}
          </text>
        </g>
      );
    }

    // Đệ quy qua các node con
    if (node.children) {
      node.children.forEach(child => {
        const childNodes = renderNodes(child);
        if (childNodes) {
          results.push(childNodes);
        }
      });
    }

    return results;
  };
  
  return (
    <div className="overflow-auto bg-white rounded-lg shadow p-4">
      <svg 
        width={maxX} 
        height={maxY}
        viewBox={`0 0 ${maxX} ${maxY}`}
        style={{ minWidth: '100%', maxWidth: '100%', height: 'auto' }}
        preserveAspectRatio="xMidYMid meet"
      >
        {tree.children.map(childNode => (
          <React.Fragment key={childNode.id}>
            {renderConnections(childNode)}
            {renderNodes(childNode)}
          </React.Fragment>
        ))}
      </svg>
    </div>
  );
}

export default DistributorTree; 
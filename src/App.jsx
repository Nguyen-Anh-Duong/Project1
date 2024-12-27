import React, { useState } from "react";
import "./App.css";

const Distributor = ({ distributor, onAddSales, onDelete, getTreeDepth }) => {
  // Tính độ sâu của node hiện tại
  const depth = getTreeDepth(distributor.code);

  return (
    <div className="distributor">
      <h4>{distributor.name} ({distributor.code})</h4>
      <p>Sales: {distributor.sales}</p>
      <div className="actions">
        <button onClick={() => onAddSales(distributor.code)}>Add Sales</button>
        <button onClick={() => onDelete(distributor.code)}>Delete</button>
      </div>
      {/* Chỉ hiển thị children nếu depth < 5 */}
      {depth < 5 && (
        <div className="children">
          {distributor.children.map((child) => (
            <Distributor
              key={child.code}
              distributor={child}
              onAddSales={onAddSales}
              onDelete={onDelete}
              getTreeDepth={getTreeDepth}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const App = () => {
  const [trees, setTrees] = useState([]);  // Các cây đã được tạo
  const [distributors, setDistributors] = useState({}); // Tất cả các nhà phân phối

  const getTreeDepth = (nodeId) => {
    const node = distributors[nodeId];
    if (!node) return 0;
  
    // Nếu là node gốc hoặc là root của một cây mới
    if (!node.parentCode || trees.some(tree => tree.code === nodeId)) return 1;
  
    // Đệ quy lên parent và cộng thêm 1 cho level hiện tại
    return getTreeDepth(node.parentCode) + 1;
  };

  const addDistributor = (code, name, parentCode = "") => {
    if (distributors[code]) {
      alert("Distributor already exists.");
      return;
    }

    const newDistributor = { code, name, parentCode, sales: 0, children: [] };
    
    
    if (!parentCode) {
      setTrees([...trees, newDistributor]);
      setDistributors({ ...distributors, [code]: newDistributor });
    } else {
      const updatedDistributors = { ...distributors };
      const parent = updatedDistributors[parentCode];

      if (parent) {
        
        if (parent.children.length < 2) {
          parent.children.push(newDistributor);
          if (getTreeDepth(parent.code) === 5) {
            setTrees(prevTrees => [...prevTrees, newDistributor]);
          }
        } else {
          const queue = [...parent.children];
          // Debug: Kiểm tra queue
          //console.log('Queue before processing:', queue);
          
          while (queue.length) {
            const current = queue.shift();
            // Debug: Kiểm tra node hiện tại
            //console.log('Current node:', current);
            
            if (current.children.length < 2) {
              current.children.push(newDistributor);
              if (getTreeDepth(current.code) === 5) {
                setTrees(prevTrees => [...prevTrees, newDistributor]);  // Lưu object thay vì code
              }
              break;
            }
            queue.push(...current.children);
          }
        }



        updatedDistributors[code] = newDistributor;
        setDistributors(updatedDistributors);
      }
    }
  };

  const addSales = (code) => {
    const amount = parseFloat(prompt("Enter sales amount:"));
    if (isNaN(amount) || amount <= 0) {
      alert("Invalid amount.");
      return;
    }

    const updatedDistributors = { ...distributors };
    updatedDistributors[code].sales += amount;
    setDistributors(updatedDistributors);
  };

  const deleteDistributor = (code) => {
    const updatedDistributors = { ...distributors };
    const distributor = updatedDistributors[code];
  
    if (!distributor) return;
  
    // Hàm lấy tất cả node con trong cùng cây
    const getAllDescendantsInSameTree = (node) => {
      let descendants = [];
      const queue = [...node.children];
      
      while (queue.length > 0) {
        const current = queue.shift();
        // Chỉ thêm vào descendants nếu node con không phải là root của cây khác
        if (!trees.some(tree => tree.code === current.code)) {
          descendants.push(current);
          queue.push(...current.children);
        }
      }
      
      return descendants;
    };
  
    // Lấy danh sách tất cả node con trong cùng cây
    const descendants = getAllDescendantsInSameTree(distributor);
    
    if (descendants.length > 0) {
      // Chọn ngẫu nhiên một node con để thay thế
      const randomIndex = Math.floor(Math.random() * descendants.length);
      const replacementNode = descendants[randomIndex];
  
      // Xóa node thay thế khỏi vị trí cũ
      const oldParent = updatedDistributors[replacementNode.parentCode];
      if (oldParent) {
        oldParent.children = oldParent.children.filter(
          child => child.code !== replacementNode.code
        );
      }
  
      // Cập nhật thông tin cho node thay thế
      replacementNode.parentCode = distributor.parentCode;
      replacementNode.children = [...distributor.children.filter(
        child => child.code !== replacementNode.code
      )];
  
      // Cập nhật parent để trỏ đến node thay thế
      if (distributor.parentCode) {
        const parent = updatedDistributors[distributor.parentCode];
        if (parent) {
          parent.children = parent.children.map(child =>
            child.code === code ? replacementNode : child
          );
        }
      } else {
        // Nếu xóa root, cập nhật trees
        setTrees(prevTrees => prevTrees.map(tree =>
          tree.code === code ? replacementNode : tree
        ));
      }
  
      // Cập nhật distributors
      updatedDistributors[replacementNode.code] = replacementNode;
      delete updatedDistributors[code];
      setDistributors(updatedDistributors);
    } else {
      // Nếu không có node con, xóa node bình thường
      if (distributor.parentCode) {
        const parent = updatedDistributors[distributor.parentCode];
        if (parent) {
          parent.children = parent.children.filter(
            child => child.code !== code
          );
        }
      } else {
        setTrees(prevTrees => prevTrees.filter(tree => tree.code !== code));
      }
      console.log(updatedDistributors);
      delete updatedDistributors[code];
      setDistributors(updatedDistributors);
    }
  };

  const calculateCommissions = () => {
    const commissions = {};

    const calculate = (distributor, commissionRate = 0.1) => {
      commissions[distributor.code] = (commissions[distributor.code] || 0) + distributor.sales * commissionRate;

      if (distributor.parentCode) {
        const parent = distributors[distributor.parentCode];
        calculate(parent, commissionRate * 0.1);
      }
    };

    Object.values(distributors).forEach((distributor) => {
      calculate(distributor);
    });

    alert(
      Object.entries(commissions)
        .map(([code, commission]) => `${code}: ${commission.toFixed(2)}`)
        .join("\n")
    );
  };

  return (
    <div className="App">
      <h1>Binary MLM Management</h1>

      <div className="add-distributor">
        <h3>Add Distributor</h3>
        <input type="text" id="code" placeholder="Code" />
        <input type="text" id="name" placeholder="Name" />
        <input type="text" id="parentCode" placeholder="Parent Code (optional)" />
        <button
          onClick={() =>
            addDistributor(
              document.getElementById("code").value,
              document.getElementById("name").value,
              document.getElementById("parentCode").value
            )
          }
        >
          Add
        </button>
      </div>

      <div className="trees">
        {trees.map((tree) => (
          <Distributor
            key={tree.code}
            distributor={tree}
            onAddSales={addSales}
            onDelete={deleteDistributor}
            getTreeDepth={getTreeDepth}
          />
        ))}
      </div>

      <button onClick={calculateCommissions} className="calculate-commissions">
        Calculate Commissions
      </button>
    </div>
  );
};

export default App;

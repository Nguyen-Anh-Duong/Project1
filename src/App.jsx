import React, { useState } from "react";
import "./App.css";

const Distributor = ({ distributor, onAddSales, onDelete }) => {
  return (
    <div className="distributor">
      <h4>{distributor.name} ({distributor.code})</h4>
      <p>Sales: {distributor.sales}</p>
      <div className="actions">
        <button onClick={() => onAddSales(distributor.code)}>Add Sales</button>
        <button onClick={() => onDelete(distributor.code)}>Delete</button>
      </div>
      <div className="children">
        {distributor.children.map((child) => (
          <Distributor
            key={child.code}
            distributor={child}
            onAddSales={onAddSales}
            onDelete={onDelete}
          />
        ))}
      </div>
    </div>
  );
};

const App = () => {
  const [trees, setTrees] = useState([]);
  const [distributors, setDistributors] = useState({});

  const addDistributor = (code, name, parentCode = "") => {
    if (distributors[code]) {
      alert("Distributor already exists.");
      return;
    }

    const newDistributor = { code, name, parentCode, sales: 0, children: [] };
    
    // Debug: Kiểm tra thông tin node mới
    console.log('Adding new distributor:', newDistributor);
    
    if (!parentCode) {
      setTrees([...trees, newDistributor]);
      setDistributors({ ...distributors, [code]: newDistributor });
    } else {
      const updatedDistributors = { ...distributors };
      const parent = updatedDistributors[parentCode];

      if (parent) {
        // Debug: Kiểm tra parent trước khi thêm
        console.log('Parent before adding:', parent);
        
        if (parent.children.length < 2) {
          parent.children.push(newDistributor);
        } else {
          const queue = [...parent.children];
          // Debug: Kiểm tra queue
          console.log('Queue before processing:', queue);
          
          while (queue.length) {
            const current = queue.shift();
            // Debug: Kiểm tra node hiện tại
            console.log('Current node:', current);
            
            if (current.children.length < 2) {
              current.children.push(newDistributor);
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

    if (distributor.parentCode) {
      const parent = updatedDistributors[distributor.parentCode];
      parent.children = parent.children.filter((child) => child.code !== code);
    } else {
      setTrees(trees.filter((tree) => tree.code !== code));
    }

    distributor.children.forEach((child) => {
      child.parentCode = distributor.parentCode;
      if (distributor.parentCode) {
        updatedDistributors[distributor.parentCode].children.push(child);
      }
    });

    delete updatedDistributors[code];
    setDistributors(updatedDistributors);
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

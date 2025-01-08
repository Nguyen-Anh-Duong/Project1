import React, { useState } from "react";
import "./App.css";
import Distributor from './Distributor';
import { DistributorsProvider } from './DistributorsContext';

const App = () => {
  const [trees, setTrees] = useState([]); // Các cây đã được tạo
  const [distributors, setDistributors] = useState({}); // Tất cả các nhà phân phối

  const getTreeDepth = (nodeId, x) => {
    const node = x[nodeId];
    if (!node) return 0;

    // neu la node root
    if (!node.parentCode) return 1;
    // goi de quy
    return getTreeDepth(node.parentCode, x) + 1;
  };

  const addDistributor = (code, name, parentCode = "") => {
    if (distributors[code]) {
      alert("Distributor already exists.");
      return;
    }

    const newDistributor = { code, name, parentCode, sales: 0, children: [] };

    if (!parentCode) {
      // neu khong co ma cap tren thi tao luon cay moi
      setTrees([...trees, newDistributor]);
      setDistributors({ ...distributors, [code]: newDistributor });
      return;
    }

    const parent = distributors[parentCode];
    
    if (!parent) {
      alert("Parent distributor not found.");
      return;
    }

    // neu do sau cua cay bang 5, tao cay moi
    if (getTreeDepth(parent.code, distributors) === 5) {
      newDistributor.parentCode = "";
      setTrees((prevTrees) => [...prevTrees, newDistributor]);
    } else {
      addChildToTree(parent, newDistributor);
    }
    setDistributors({ ...distributors, [code]: newDistributor });
  };

  // parent co do sau < 5
  const addChildToTree = (parent, newDistributor) => {
    if (parent.children.length < 2) {
      //console.log("pppp", parent)
      newDistributor.parentCode = parent.code;
      // const updatedParent = { ...parent, children: [...parent.children, newDistributor] };
      // setDistributors((prev) => ({ ...prev, [parent.code]: updatedParent }));
      parent.children.push(newDistributor);
      return;
    }
    const queue = [...parent.children];

    while (queue.length) {
      const current = queue.shift();

      // neu depth current = 5, tao cay moi
      if (getTreeDepth(current.code, distributors) === 5) {
        newDistributor.parentCode = "";
        setTrees((prevTrees) => [...prevTrees, newDistributor]);
        return;
      }

      // Neu current co do sau < 5, kiem tra xem co them con duoc khong
      if (current.children.length < 2) {
        newDistributor.parentCode = current.code;
        // const updatedCurrent = { ...current, children: [...current.children, newDistributor] };
        // setDistributors((prev) => ({ ...prev, [current.code]: updatedCurrent }));
        current.children.push(newDistributor);
        return;
      }
      // neu khong them con duoc, thi tiep tuc duyet do thi
      queue.push(...current.children);
    }
  };

  const addSales = (code) => {
    const amount = parseFloat(prompt("Enter sales amount:"));
    if (isNaN(amount) || amount < 0) {
      alert("Invalid amount.");
      return;
    }

    const updatedDistributors = { ...distributors };
    updatedDistributors[code].sales = amount;
    setDistributors(updatedDistributors);
  };

  const deleteDistributor = (code) => {
    const distributor = distributors[code];
    if (!distributor) {
      alert("Distributor not found.");
      return;
    }

    //Truong hop neu distributor la root cua cay
    if (!distributor.parentCode) {
      // neu cay chi co mot node la distributor
      if (distributor.children.length === 0) {
        // xoa cay
        setTrees((prevTrees) => prevTrees.filter((tree) => tree.code !== code));
        delete distributors[code];
        alert(`Root distributor ${code} and its tree deleted.`);
        return;
      } else {
        // neu root co node con
        const randomIndex = Math.floor(
          Math.random() * distributor.children.length
        );
        const replacement = distributor.children[randomIndex];

        distributor.children.length === 2
          ? rearrangeTree(replacement, distributor.children[1 - randomIndex])
          : rearrangeTree(replacement, null);
        replacement.parentCode = "";
        setTrees((prevTrees) =>
          prevTrees.map((tree) => (tree.code === code ? replacement : tree))
        );

        const updatedDistributors = { ...distributors };
        delete updatedDistributors[code];
        setDistributors(updatedDistributors);
        //dang sai doan nay
        alert(`Root distributor ${code} replaced with ${replacement.code}.`);
        return;
      }
    }

    //Truong hop neu distributor khong phai la root
    const parent = distributors[distributor.parentCode];
    if (!parent) {
      alert("Parent not found.");
      return;
    }

    // neu distributor khong co node con, thi xoa luon
    if (distributor.children.length === 0) {
      parent.children = parent.children.filter((child) => child.code !== code);
      const updatedDistributors = { ...distributors };
      delete updatedDistributors[code];
      setDistributors(updatedDistributors);
      alert(`Distributor ${code} deleted.`);
      return;
    }

    // neu distributor co con, chon ngau nhien mot con
    const randomIndex = Math.floor(Math.random() * distributor.children.length);
    //node thay the cho distributor
    const replacement = distributor.children[randomIndex];

    if (distributor.children.length === 2) {
      if (!replacement) console.log(distributor.children.length);
      rearrangeTree(replacement, distributor.children[1 - randomIndex]);
    } else {
      if (!replacement) console.log(distributor.children.length);
      rearrangeTree(replacement, null);
    }
    replacement.parentCode = distributor.parentCode;
    parent.children = parent.children.map((child) =>
      child.code === code ? replacement : child
    );

    // xoa distributor
    const updatedDistributors = { ...distributors };
    delete updatedDistributors[code];
    setDistributors(updatedDistributors);
    alert(`Distributor ${code} deleted.`);
    return;
  };

  const rearrangeTree = (replacement, siblingOfReplacement) => {
    // neu replacement khong co anh em, thi return luon
    if (!siblingOfReplacement) {
      return;
    }

    // neu replacement co anh em, va replacement co toi da mot node con, thi cho node anh em do lam node con cua replacement
    if (replacement.children.length < 2) {
      replacement.children.push(siblingOfReplacement);
      siblingOfReplacement.parentCode = replacement.code;
      return;
    }

    // neu replacement da co 2 con, thi lay ngau nhien 1 trong 2 node con
    const randomIndex = Math.floor(Math.random() * 2);
    // node con duoc chon de thay the bang siblingOfReplacement
    // randomChildren la node giu nguyen tang cua no, con anh em cua no cung voi siblingOfReplacement la node con cua replacement
    const randomChildren = replacement.children[randomIndex];
    replacement.children[randomIndex] = siblingOfReplacement;
    siblingOfReplacement.parentCode = replacement.code;
    rearrangeTree(replacement.children[1 - randomIndex], randomChildren);
  };

  const calculateCommissions = () => {
    const commissions = {};

    //ham de quy tinh hoa hong
    const calculate = (distributor, commissionRate = 0.1) => {
      if (!distributor) return 0;

      commissions[distributor.code] =
        calculate(distributor.children[0]) * 0.1 +
        calculate(distributor.children[1]) * 0.1 +
        distributor.sales * commissionRate;
      return commissions[distributor.code];
    };

    trees.forEach((root) => calculate(root));

    // Xuat file hoa hong
    const commissionsData = Object.entries(commissions)
      .map(([code, commission]) => {
        const distributor = distributors[code];
        return {
          code,
          name: distributor.name,
          sales: distributor.sales,
          commission: parseFloat(commission.toFixed(2))
        };
      });

    const blob = new Blob(
      [JSON.stringify({ 
        time: new Date().toLocaleString(),
        commissions: commissionsData 
      }, null, 2)],
      { type: 'text/plain' }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `commissions.${new Date().toLocaleDateString().split('/').join('-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Ham export data
  const exportData = () => {
    const exportDistributorsData = { ...distributors };
    Object.keys(exportDistributorsData).forEach(key => {
      delete exportDistributorsData[key].children;
    });
    const data = {
      distributors : exportDistributorsData
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `distributor-data.${new Date().toLocaleDateString().split('/').join('-')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Ham import data
  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          const distributorsCopy = { ...data.distributors };

          // xay dung trees dua tren du lieu distributors
          const {roots, distributors} = buildForest(distributorsCopy);
          setTrees(roots);
          setDistributors(distributors);
        } catch (error) {
          alert(error.message);
          setTrees([]);
          setDistributors({});
        } finally {
          event.target.value = null;
        }
      };
      reader.readAsText(file);
    }
  };

  const buildForest = (distributorsData) => {
    const roots = [];
    const map = {};
    // tao mot ban do de de dang truy cap cac distributor
    Object.values(distributorsData).forEach(distributor => {
      if (map[distributor.code]) {
        throw new Error(`Wrong data! Distributor ${distributor.code} is duplicated`);
      }
      map[distributor.code] = { ...distributor, children: [] };
    });
    
    // xay dung mang cac root node
    Object.values(map).forEach(distributor => {
      if (distributor.parentCode) {
        map[distributor.parentCode].children.push(distributor);
        if (map[distributor.parentCode].children.length > 2)
{
  throw new Error (`Wrong data! Distributor ${distributor.parentCode} has more than 2 children`);
} else if (getTreeDepth(distributor.parentCode, map) === 5){
  
  throw new Error(`Wrong data! Distributor ${distributor.code} is in the 6th level`);
}   } else {
        roots.push(distributor);
      }
    });

    return {roots, distributors: map};
  };
  

  return (
    <DistributorsProvider distributors={distributors}>
    <div className="App">
      <h1>Project 1 - Nguyen Anh Duong</h1>

      <div className="data-controls">
        <input
          type="file"
          accept=".txt"
          onChange={importData}
          style={{ display: 'none' }}
          id="import-input"
        />
        <button onClick={() => document.getElementById('import-input').click()}>
          Import Data
        </button>
        <button onClick={exportData}>Export Data</button>
      </div>

      <div className="add-distributor">
        <h3>Add Distributor</h3>
        <input type="text" id="code" placeholder="Code" />
        <input type="text" id="name" placeholder="Name" />
        <input
          type="text"
          id="parentCode"
          placeholder="Parent Code (optional)"
        />
        <button
          onClick={() =>
          {
            
            addDistributor(
              document.getElementById("code").value,
              document.getElementById("name").value,
              document.getElementById("parentCode").value
            )
            
          }
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
    </DistributorsProvider>
  );
};

export default App;

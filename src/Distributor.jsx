import React, { useContext } from 'react';
import { DistributorsContext } from './DistributorsContext';

const Distributor = ({ distributor, onAddSales, onDelete, getTreeDepth }) => {
  const distributors = useContext(DistributorsContext); // Access distributors here

  // Tính độ sâu của node hiện tại
  const depth = getTreeDepth(distributor.code, distributors);

  return (
    <div className="distributor" data-depth={depth}>
      <h4>
        {distributor.name} ({distributor.code}) - Level {depth}
      </h4>
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
            getTreeDepth={getTreeDepth}
          />
        ))}
      </div>
    </div>
  );
};

export default Distributor;
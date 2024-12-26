class Distributor {
    constructor(id, name, parentId = null) {
      this.id = id;
      this.name = name;
      this.parentId = parentId;
      this.left = null;
      this.right = null;
      this.level = 1;
    }
  }
  
  export default Distributor;
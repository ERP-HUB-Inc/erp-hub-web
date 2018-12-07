import Listiew from "../../../common/components/shares/List";
export default class List extends Listiew {
  constructor(props){
    super(props);
    this.module = "settings";
  }
    
  // componentDidMount(){
  //   super.componentDidMount();

  //   const classelement = document.getElementById("btnAdd");
  //   // if(window.screen.availHeight < 1000){
  //   if(classelement){
  //     classelement.addEventListener("click", () => {
  //       console.log("addclass");
  //       const classModalName = document.getElementsByClassName("table-wrapper");
  //       if(classModalName){
  //         classModalName.classList.add("otherclass");
  //       }
  //     });
  //   }
   
  //   // }

  // }

}


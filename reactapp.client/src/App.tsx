import { DashboardLayoutComponent } from "@syncfusion/ej2-react-layouts";
import { useRef, useState } from "react";
import DashboardModal from "./InlineFunctions/DashboardDetail";
import { createPortal } from "react-dom";
import SaveDashboard from "./Utils/SaveDashboard";
import AddAllPanels from "./Utils/AddAllPanels";
import "./App.css";
function App() {
  const queryParameters = new URLSearchParams(location.search);
  //parameter name could be given as personId , PersonId, PersonID, it will be fixed later
  let PersonId = Number(queryParameters.get("personId"));
  if (PersonId === 0 || PersonId === null) {
    PersonId = Number(queryParameters.get("PersonId"));
  }
  if (PersonId === 0 || PersonId === null) {
    PersonId = Number(queryParameters.get("PersonID"));
  }
  if (PersonId === 0 || PersonId === null || PersonId === 1) {
    PersonId = 1;
  }
  const cellSpacing: number[] = [10, 20];
  const dashboardObj = useRef<DashboardLayoutComponent>(null);

  const [DashboardmodalOpen, setIsModalOpen] = useState(false);

  const addPanels = () => {
    const dashboard = dashboardObj.current as DashboardLayoutComponent;
    AddAllPanels(PersonId, dashboard);
  };

  const saveDashboard = () => {
    if (dashboardObj.current) {
      const dashboard = dashboardObj.current as DashboardLayoutComponent;
      const PersonID = PersonId;
      SaveDashboard(PersonID, dashboard);
    }
  };
  const onPanelResize = (args: any) => {
    if (args.element && args.element.id === "ProcessDiagramPnl") {
      console.log("Panel 2 is being resized!");
      const ProcessDiagramPnl = document.getElementById("ProcessDiagramPnl");
      const diagramEl = document.getElementById("diagram");
      const symbolpaletteEl = document.getElementById("symbolpalette");
      if (ProcessDiagramPnl && diagramEl) {
        diagramEl.style.width = ProcessDiagramPnl.clientWidth + "px";
        diagramEl.style.height = ProcessDiagramPnl.clientHeight - 30 + "px";
        symbolpaletteEl!.style.height =
          ProcessDiagramPnl.clientHeight - 30 + "px";
      }
    }
  };
  const setUserPanelIDs = () => {
    const dashboard = dashboardObj.current as DashboardLayoutComponent;
    const panelIds: string[] = [];
    for (let j = 0; j < dashboard.panels.length; j++) {
      if (dashboard.panels[j].id) {
        panelIds.push(dashboard.panels[j].id as string);
      }
    }
    return panelIds;
  };
  return (
    <>
      {DashboardmodalOpen &&
        createPortal(
          <DashboardModal
            UserPanels={setUserPanelIDs()}
            showModal={DashboardmodalOpen}
            modalStatusHandler={setIsModalOpen}
          ></DashboardModal>,
          document.body,
        )}
      <div
        id="mainContentDiv"
        className="container-fluid mainContentyMarginLeft "
      >
        <div className="row mt-2">
          <div className="col">
            <DashboardLayoutComponent
              ref={dashboardObj}
              showGridLines={true}
              type="responsive"
              id="predefine_dashboard"
              draggableHandle=".e-panel-header"
              columns={6}
              cellSpacing={cellSpacing}
              allowResizing={true}
              allowFloating={false}
              resizableHandles={[
                "e-south-east",
                "e-east",
                "e-west",
                "e-north",
                "e-south",
              ]}
              created={addPanels}
              dragStop={saveDashboard}
              resizeStop={saveDashboard}
              resize={onPanelResize}
            ></DashboardLayoutComponent>
          </div>
        </div>
      </div>
    </>
  );
}
export default App;

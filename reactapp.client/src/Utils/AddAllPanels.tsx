import MyProcesses from "../Reports/MyProcesses";
import ProcessNavigation from "../Charts/ProcessNavigation";
import { DashboardLayoutComponent } from "@syncfusion/ej2-react-layouts/index";
import OrganizationChart from "../Charts/OrganizationChart";
import callAPI from "../ApiCall";
import type { DashboardModel } from "../IncomingModels/DashboardModel";
import SaveDashboard from "./SaveDashboard";

export function AddAllPanels(
  PersonId: number,
  dashboard: DashboardLayoutComponent,
) {
  const Panels: typeof records = [];
  const records = [
    {
      id: "MyProcessesPnl",
      sizeX: 2,
      sizeY: 2,
      row: 2,
      col: 2,
      content: () => MyProcesses(PersonId),
      header:
        "<div className='header'>Process Diagram</div><span className='handler e-icons burg-icon'></span>",
    },
    {
      id: "ProcessNavigationPnl",
      sizeX: 2,
      sizeY: 2,
      row: 2,
      col: 0,
      content: () => ProcessNavigation(),
      header:
        "<div className='header'>Mind Map</div><span className='handler e-icons burg-icon'></span>",
    },
    {
      id: "OrganizationPnl",
      sizeX: 2,
      sizeY: 2,
      row: 8,
      col: 0,
      content: () => OrganizationChart(),
      header:
        "<div className='header'>Organization Chart</div><span className='handler e-icons burg-icon'></span>",
    },
  ];

  const getUsersPanels = (PersonID: number) => {
    const DashboardApi = "/General/GetDashboardPanels";
    const param: { PersonID: number } = { PersonID: PersonID };
    const paramsInString = JSON.stringify(param);
    const paramsInJSON = JSON.parse(paramsInString);
    callAPI(DashboardApi, paramsInJSON)
      .then((response: any) => {
        if (response != null && response !== undefined) {
          const UserDash: DashboardModel[] = response;
          let panelID = "";
          for (let i = 0; i <= records.length; i++) {
            if (records[i]) {
              panelID = records[i].id as string;
              for (let j = 0; j < UserDash.length; j++) {
                if (panelID === UserDash[j].id) {
                  records[i].sizeX = UserDash[j].sizeX;
                  records[i].sizeY = UserDash[j].sizeY;
                  records[i].row = UserDash[j].row;
                  records[i].col = UserDash[j].col;
                  Panels.push(records[i]);
                  break;
                }
              }
            }
          }
          dashboard.removeAll();
          for (let i = 0; i <= Panels.length - 1; i++) {
            dashboard.addPanel(Panels[i]);
          }
          SaveDashboard(PersonId, dashboard);
        }
      })
      .catch((error) => {
        if (error instanceof Error) {
          console.error(`Error: ${error.message}`);
        } else {
          console.error("Unexpected error:", error);
        }
        throw error;
      });
  };

  getUsersPanels(PersonId);
}

export default AddAllPanels;

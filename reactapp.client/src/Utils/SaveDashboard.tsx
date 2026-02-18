import { AxiosError } from "axios";
import callAPI from "../ApiCall";
import { DashboardLayoutComponent } from "@syncfusion/ej2-react-layouts/index";

export function SaveDashboard(
  PersonId: number,
  dashboard: DashboardLayoutComponent,
) {
  if (dashboard) {
    type Panel = {
      id: string | number;
      sizeX: number;
      sizeY: number;
      row: number;
      col: number;
      content: string;
      header: string;
    };
    const panels: Panel[] = [];
    for (let i = 0; i < dashboard.panels.length; i++) {
      panels.push({
        id: dashboard.panels[i].id ?? "",
        sizeX: dashboard.panels[i].sizeX ?? 0,
        sizeY: dashboard.panels[i].sizeY ?? 0,
        row: dashboard.panels[i].row ?? 0,
        col: dashboard.panels[i].col ?? 0,
        content: "'" + dashboard.panels[i].content + "'",
        header:
          dashboard.panels[i].header !== undefined
            ? String(dashboard.panels[i].header)
            : "",
      });
    }
    if (panels.length > 0) {
      const params: { UserID: number; UserPanelList: Panel[] } = {
        UserID: PersonId,
        UserPanelList: panels,
      };
      const paramsInString = JSON.stringify(params);
      const paramsInJSON = JSON.parse(paramsInString);
      const AppApi = "General/UpdateUsersDashboard/";
      callAPI(AppApi, paramsInJSON)
        .then((response) => {
          if (response === false) {
            alert("Internal error on updating Dashboard");
          }
        })
        .catch((error: AxiosError) => {
          console.error(`Error: ${error.message}`);
        });
    }
  }
}
export default SaveDashboard;

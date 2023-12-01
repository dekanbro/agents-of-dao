import { Routes as Router, Route } from "react-router-dom";

import { LayoutContainer } from "./pages/LayoutContainer";
import { Home } from "./pages/Home";
import { AgentList } from "./pages/AgentList";
import { AgentDetail } from "./pages/AgentDetail";
import { TopAgentList } from "./pages/TopAgentList";


export const Routes = () => {
  return (
    <Router>
      <Route path="/" element={<LayoutContainer />}>
      <Route path="/"     element={<Home />} />
      <Route path="/agent" element={<AgentList />} />
      <Route path="/agent/:agentId" element={<AgentDetail />} />
      <Route path="/top-agents" element={<TopAgentList />} />
      </Route>
    </Router>
  );
};

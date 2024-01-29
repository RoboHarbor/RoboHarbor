import { BrowserRouter } from 'react-router-dom';

// routes
import { AllRoutes } from './index';
import {Toaster} from "react-hot-toast";

const Routes = () => {
  return (
    <BrowserRouter>
        <Toaster
            position="top-right"
            reverseOrder={false}

        />
      <AllRoutes />
    </BrowserRouter>
  );
};

export default Routes;

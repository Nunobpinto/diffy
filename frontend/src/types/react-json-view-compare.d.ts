declare module 'react-json-view-compare' {
    import * as React from 'react';
  
    interface ReactJsonViewCompareProps {
      oldData: Record<string, any> | any[];
      newData: Record<string, any> | any[];
    }
  
    const ReactJsonViewCompare: React.FC<ReactJsonViewCompareProps>;
  
    export default ReactJsonViewCompare;
  }
  
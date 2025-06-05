import {IconButton, List, ListItem, ListItemText, ListSubheader, Table, TableBody,TableCell, TableHead, TableRow } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';

import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useFetchDifferencesQuery } from '../noise/noiseApiSlice';
import { openRequestView, selectRequest } from '../selections/selectionsSlice';

export function FieldsView(){
    const dispatch = useAppDispatch();
    const excludeNoise = useAppSelector((state) => state.selections.noiseCancellationIsOn);
    const selectedEndpoint = useAppSelector((state) => state.selections.endpointName) || 'unknown';
    const selectedFieldPrefix = "response.status";
    const {start, end} = useAppSelector((state) => state.selections.dateTimeRange);
    const differenceResults = useFetchDifferencesQuery({excludeNoise, selectedEndpoint, selectedFieldPrefix, includeWeights:true, start, end}).data || {endpoint:'undefined', path:'undefined', requests:[]};
    if(!differenceResults.requests.length) {
      return <List subheader={<ListSubheader>Differences</ListSubheader>}>
        <ListItem><ListItemText>No differences.</ListItemText></ListItem>
      </List>
    }
    const {requests} = differenceResults
    const differences = requests.flatMap((request) => {
        const requestId = request.id
        return Object.entries(request.differences).flatMap(([key, diff]) => {
          if(!key.startsWith(selectedFieldPrefix)){
            return [];
          }
          const { left, right } = diff
          return [{requestId, left, right, key:`${selectedEndpoint}.${key}.${requestId}`}];
        });
      });
    return <List subheader={<ListSubheader>Differences</ListSubheader>}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>{'Request id'}</TableCell>
            <TableCell>{'Primary Response'}</TableCell>
            <TableCell>{'Candidate Response'}</TableCell>
            <TableCell>{'Diff'}</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
        {
        differences.map(({requestId, left, right, key}) => {
            return <TableRow key={key}>
              <TableCell>{requestId}</TableCell>
              <TableCell>{left}</TableCell>
              <TableCell>{right}</TableCell>
              <TableCell>
                <IconButton
                  onClick={() => {
                    dispatch(selectRequest(requestId));
                    dispatch(openRequestView());
                  }}>
                <OpenInNewIcon/>
                </IconButton>
              </TableCell>
            </TableRow>;
          })}
          </TableBody>
        </Table>
        </List>;
    }
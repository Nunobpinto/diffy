import {AppBar, IconButton, ListItem, ListItemText, Table, TableBody,TableCell, TableContainer, TableHead, TableRow, Toolbar } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { useFetchRequestQuery } from './requestsApiSlice';
import ReactJsonViewCompare from 'react-json-view-compare';
import CloseIcon from '@mui/icons-material/Close';
import { closeRequestView } from '../selections/selectionsSlice';

export function RequestView(){
    const dispatch = useAppDispatch();
    const requestId = useAppSelector((state) => state.selections.requestId)
    const request = requestId && useFetchRequestQuery(requestId as string).data;

    if(!request) {
        return (<ListItem><ListItemText>No requests.</ListItemText></ListItem>)
    }

    return (
        <>
        <AppBar sx={{ position: 'relative' }}>
            <Toolbar>
            <IconButton
                edge="start"
                color="inherit"
                onClick={()=>{dispatch(closeRequestView())}}
                aria-label="close"
            >
                <CloseIcon />   
            </IconButton>
            </Toolbar>
        </AppBar>
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow><TableCell>Difference</TableCell></TableRow>
                </TableHead>
                <TableBody>
                    <TableRow>
                        <ReactJsonViewCompare oldData={request.left} newData={request.right} />
                    </TableRow>
                </TableBody>
            </Table>
            <Table>
                <TableHead><TableRow><TableCell>Request</TableCell></TableRow></TableHead>
                <TableBody><TableRow><TableCell>{<pre>{JSON.stringify(request.request,null,4)}</pre>}</TableCell></TableRow></TableBody>
            </Table>
        </TableContainer>
        </>
    );
}
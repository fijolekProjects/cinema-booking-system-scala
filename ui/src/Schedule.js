import React, {useEffect} from 'react';
import moment from 'moment';
import useStyles from "./material-styles/useStyles";
import Button from "@material-ui/core/Button";
import TodayIcon from "@material-ui/icons/Today";
import * as HttpService from "./http/HttpService";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Container from "@material-ui/core/Container";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import DialogActions from "@material-ui/core/DialogActions";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import "react-big-calendar/lib/css/react-big-calendar.css";
import {Calendar, momentLocalizer} from "react-big-calendar";
import _ from 'lodash';
import TextField from '@material-ui/core/TextField';

export default function Schedule() {
    const localizer = momentLocalizer(moment);
    const [scheduledMovies, setScheduledMovies] = React.useState([]);

    useEffect(() => {
        listAllScheduledMovies()
    }, []);

    const listAllScheduledMovies = () => {
        HttpService.fetchJson('schedule/movie/list').then( movies => {
            const formattedMovies = movies.map(movie =>
            { return {
                title: movie.title,
                start: moment(movie.start).toDate(),
                end:  moment(movie.end).toDate()
                }
            })
            setScheduledMovies(formattedMovies)
        })
    }
    return(
        <div>
            <ScheduleDialog refreshScheduledMovies={ listAllScheduledMovies } />
            { !_.isEmpty(scheduledMovies)  ? <Calendar
                min={moment().hours(10).minutes(0).seconds(0).milliseconds(0).toDate()}
                defaultView={'week'}
                views={['week']}
                localizer={localizer}
                events={scheduledMovies}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 700 }}
            /> : null }
        </div>

    )
}


function ScheduleDialog(props) {
    const [open, setOpen] = React.useState(false);
    const [cinemaHalls, setCinemaHalls] = React.useState([]);
    const [movies, setMovies] = React.useState([]);
    const [cinemaHall, setCinemaHall] = React.useState('')
    const [dateOfProjection, setDateOfProjection] = React.useState("")
    const [movie, setMovie] = React.useState('')
    const classes = useStyles();

    useEffect(() => {
        listAllMovies()
        listAllCinemaHalls()
    }, []);

    const listAllMovies = () => {
        HttpService.fetchJson('movie/list').then(movies => {
            setMovies(movies)
        })
    }

    const listAllCinemaHalls = () => {
        HttpService.fetchJson('cinemahall/list').then(cinemahalls => {
            setCinemaHalls(cinemahalls)
        })
    }

    const openDialog = () => {
        setOpen(true);
    }

    const closeDialog = () => {
        setOpen(false);
    }

    const addScheduledMovie = () => {
        closeDialog()
        props.refreshScheduledMovies()
    }

    return (
        <div>
            <Button
                variant="contained"
                color="secondary"
                className={classes.button}
                startIcon={<TodayIcon/>}
                onClick={openDialog}
            >
                New schedule
            </Button>
            <Dialog open={open} onClose={closeDialog} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add new scheduled movie</DialogTitle>
                <DialogContent>
                    <DialogContentText>Add schedule for this week.</DialogContentText>
                    <Container component="main" maxWidth="xs">
                        <CssBaseline/>
                        <div className={classes.paper}>
                            <form className={classes.form} noValidate>
                                <Grid container spacing={2}>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-outlined-label">Movie</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={movie}
                                            onChange={ (event) =>
                                                setMovie(event.target.value) }
                                            label="Movie"
                                        >
                                            {movies.map((movie, idx) =>
                                                <MenuItem key={idx} value={movie.id}>{movie.title}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                    <FormControl variant="outlined" className={classes.formControl}>
                                        <InputLabel id="demo-simple-select-outlined-label">Cinema Hall</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-outlined-label"
                                            id="demo-simple-select-outlined"
                                            value={cinemaHall}
                                            onChange= { (event) =>
                                        setCinemaHall(event.target.value) }
                                            label="Cinema Hall"
                                        >
                                            {cinemaHalls.map((cinemaHall, idx) =>
                                                <MenuItem key={idx} value={cinemaHall.id}>{cinemaHall.id}</MenuItem>
                                            )}
                                        </Select>
                                    </FormControl>
                                    <TextField
                                        id="datetime-local"
                                        label="Date of projection"
                                        className={classes.textField}
                                        type="datetime-local"
                                        value={dateOfProjection}
                                        InputLabelProps={{
                                            shrink: true,
                                        }}
                                        onChange={event => setDateOfProjection(event.target.value)}
                                    />
                                </Grid>
                            </form>
                        </div>
                    </Container>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeDialog} color="primary">Cancel</Button>
                    <Button color="primary" onClick={addScheduledMovie}>Add</Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}
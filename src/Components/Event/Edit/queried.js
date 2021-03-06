import React from 'react';
import { Mutation } from 'react-apollo';

import {
  Paper,
  Typography,
  AppBar,
  Tabs,
  Tab,
} from '@material-ui/core';
import {
  Face as BasicIcon,
  Alarm as TechnicalIcon,
  Group as TeamAndServerIcon,
  PresentToAll as PresentationIcon,
} from '@material-ui/icons';
import { withStyles } from '@material-ui/core/styles';
import styles from './styles';

import {
  Basic,
  PresentationPage,
  TeamsServer,
  Technical,
} from './Tabs';

import { hostedEventsCalls } from '../../../GraphQL/Calls/index';

function TabContainer(props) {
  return (
    <Typography component='div' style={{ padding: 8 * 3 }}>
      {props.children}
    </Typography>
  );
}

class Queried extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      title: this.props.event.title,
      subtitle: this.props.event.subtitle,
      description: this.props.event.description,
      startDatetime: this.props.event.startDatetime * 1000,
      finishDatetime: this.props.event.finishDatetime * 1000,
      formulaId: this.props.event.formula.id,
      plotterId: this.props.event.plotter.id,
      prizes: this.props.event.prizes,
      rules: this.props.event.rules,
    };
  }

  handleTabChange = (event, value) => {
    this.setState({ value });
  }

  handleEventChange = (newType, newVal) => {
    this.setState({ [newType]: newVal });
  }


  render() {
    const {
      title,
      subtitle,
      description,
      startDatetime,
      finishDatetime,
      value,
      formulaId,
      plotterId,
      prizes,
      rules,
    } = this.state;
    const { classes } = this.props;
    return (
      <React.Fragment>
        <Mutation mutation={hostedEventsCalls.EVENTS_CREATEEVENT}
          update={(store, { data }) => {
            this.props.history.push(`/events/edit/${data.events_CreateEvent.id}`);
          }
          }
        >
          {hostEvent => (
            <div className={classes.root}>
              <AppBar position='static' color='default'>
                <Tabs
                value={value}
                onChange={this.handleTabChange}
                scrollable
                scrollButtons='off'
                indicatorColor='primary'
                textColor='primary'
              >
                  <Tab
                  className={classes.tabTitle}
                  label='Basic information'
                  icon={<BasicIcon />}
                />
                  <Tab
                  className={classes.tabTitle}
                  label='Technical information'
                  icon={<TechnicalIcon />}
                />
                  <Tab
                  className={classes.tabTitle}
                  label='Teams &amp; server setup(disabled)'
                  icon={<TeamAndServerIcon />}
                  disabled
                />
                  <Tab
                  className={classes.tabTitle}
                  label='Presentation page(disabled)'
                  icon={<PresentationIcon />}
                  disabled
                />
                </Tabs>
              </AppBar>
              <div className='container'>
                <Paper className={classes.paperRoot}>
                  <Typography className={classes.typography} variant='h5' gutterBottom>
                    Create a new event
                  </Typography>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      hostEvent({
                        variables: {
                          event: {
                            title,
                            subtitle,
                            description,
                            startDatetime: startDatetime.valueOf() / 1000,
                            finishDatetime: finishDatetime.valueOf() / 1000,
                            formulaId,
                            plotterId,
                          },
                        },
                      });
                    }}
                  >
                    {value === 0 && <TabContainer>
                      <Basic
                        event={{
                          title,
                          subtitle,
                          description,
                          startDatetime,
                          finishDatetime,
                        }}
                        edit={(newType, newVal) => this.handleEventChange(newType, newVal)}
                      />
                    </TabContainer>}
                    {value === 1 && <TabContainer>
                      <Technical
                        event={{
                          formulaId,
                          plotterId,
                          prizes,
                          rules,
                        }}
                        edit={(newType, newVal) => this.handleEventChange(newType, newVal)}
                      />
                    </TabContainer>}
                    {value === 2 && <TabContainer><TeamsServer /></TabContainer>}
                    {value === 3 && <TabContainer><PresentationPage /></TabContainer>}
                  </form>
                </Paper>
              </div>
            </div>
          )}
        </Mutation>
      </React.Fragment>
    );
  }
}

export default withStyles(styles)(Queried);

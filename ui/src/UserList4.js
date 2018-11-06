import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./UserList.css";
import { withStyles } from "@material-ui/core/styles";

import fusioncharts from "fusioncharts";
import charts from "fusioncharts/fusioncharts.charts";
import ReactFusioncharts from "react-fusioncharts";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tooltip,
  Paper,
  TableSortLabel
} from "@material-ui/core";

// Resolves charts dependancy
charts(fusioncharts);

let chartConfigs = {
  type: "column2d", // The chart type
  width: "400", // Width of the chart
  height: "400", // Height of the chart
  dataFormat: "json", // Data type
  dataSource: {
    // Chart Configuration
    chart: {
      caption: "Employee",
      subCaption: "Counts sold",
      xAxisName: "Employee",
      yAxisName: "Counts",
      theme: "fusion"
    },
    // Chart Data
    data: {}
  }
};

const dataSource = {
  chart: {
    caption: "App Publishing Trend",
    subcaption: "2012-2016",
    xaxisname: "Years",
    yaxisname: "Total number of apps in store",
    formatnumberscale: "1",
    plottooltext:
      "<b>$dataValue</b> apps were available on <b>$seriesName</b> in $label",
    theme: "fusion",
    drawcrossline: "1"
  },
  categories: [
    {
      category: [
        {
          label: "2012"
        },
        {
          label: "2013"
        },
        {
          label: "2014"
        },
        {
          label: "2015"
        },
        {
          label: "2016"
        }
      ]
    }
  ],
  dataset: [
    {
      seriesname: "iOS App Store",
      data: [
        {
          value: "125000"
        },
        {
          value: "300000"
        },
        {
          value: "480000"
        },
        {
          value: "800000"
        },
        {
          value: "1100000"
        }
      ]
    },
    {
      seriesname: "Google Play Store",
      data: [
        {
          value: "70000"
        },
        {
          value: "150000"
        },
        {
          value: "350000"
        },
        {
          value: "600000"
        },
        {
          value: "1400000"
        }
      ]
    },
    {
      seriesname: "Amazon AppStore",
      data: [
        {
          value: "10000"
        },
        {
          value: "100000"
        },
        {
          value: "300000"
        },
        {
          value: "600000"
        },
        {
          value: "900000"
        }
      ]
    }
  ]
};

const styles = theme => ({
  root: {
    maxWidth: 700,
    marginTop: theme.spacing.unit * 3,
    overflowX: "auto",
    margin: "auto"
  },
  table: {
    minWidth: 700
  }
});

class UserList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      order: "asc",
      orderBy: "firstName",
      page: 0,
      rowsPerPage: 10
    };
  }

  handleSortRequest = property => {
    const orderBy = property;
    let order = "desc";

    if (this.state.orderBy === property && this.state.order === "desc") {
      order = "asc";
    }

    this.setState({ order, orderBy });
  };

  actualiza = datos => {
    const update_data = datos.map(n => {
      return {
        label: n.firstName,
        value: n.numProducts
      };
    });
    chartConfigs.dataSource.data = update_data;
  };

  render() {
    const { order, orderBy } = this.state;
    return (
      <Query
        query={gql`
          query usersPaginateQuery(
            $first: Int
            $offset: Int
            $orderBy: _EmployeeOrdering
          ) {
            Employee(first: $first, offset: $offset, orderBy: $orderBy) {
              _id
              firstName
              numProducts
              avgPrice
            }
          }
        `}
        variables={{
          first: this.state.rowsPerPage,
          offset: this.state.rowsPerPage * this.state.page,
          orderBy: this.state.orderBy + "_" + this.state.order
        }}
      >
        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error</p>;
          return (
            /*<Paper className={this.props.classes.root}>*/
            <Paper className="container-fluid">
              <div className="row">
                <div className="col-12 col-md-7">
                  <Table className={this.props.classes.table}>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          key="firstName"
                          sortDirection={
                            orderBy === "firstName" ? order : false
                          }
                        >
                          <Tooltip
                            title="Sort"
                            placement="bottom-start"
                            enterDelay={300}
                          >
                            <TableSortLabel
                              active={orderBy === "firstName"}
                              direction={order}
                              onClick={() =>
                                this.handleSortRequest("firstName")
                              }
                            >
                              First Name
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          key="numProducts"
                          sortDirection={
                            orderBy === "numProducts" ? order : false
                          }
                          numeric
                        >
                          <Tooltip
                            title="Sort"
                            placement="bottom-end"
                            enterDelay={300}
                          >
                            <TableSortLabel
                              active={orderBy === "numProducts"}
                              direction={order}
                              onClick={() =>
                                this.handleSortRequest("numProducts")
                              }
                            >
                              numProducts
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>
                        <TableCell
                          key="avgPrice"
                          sortDirection={orderBy === "avgPrice" ? order : false}
                          numeric
                        >
                          <Tooltip
                            title="Sort"
                            placement="bottom-start"
                            enterDelay={300}
                          >
                            <TableSortLabel
                              active={orderBy === "avgPrice"}
                              direction={order}
                              onClick={() => this.handleSortRequest("avgPrice")}
                            >
                              avgPrice
                            </TableSortLabel>
                          </Tooltip>
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <div id="container">
                      <div id="left" />
                      <div id="right" />
                      <div id="center" />
                    </div>
                    <TableBody>
                      {data.Employee.map(n => {
                        return (
                          <TableRow key={n._id}>
                            <TableCell component="th" scope="row">
                              {n.firstName}
                            </TableCell>
                            <TableCell numeric>{n.numProducts}</TableCell>
                            <TableCell numeric>{n.avgPrice}</TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
                <div className="col-12 col-md-5">
                  {/*this.actualiza(data.Employee)*/}
                  <ReactFusioncharts
                    type="msbar2d"
                    width="100%"
                    height="100%"
                    dataFormat="JSON"
                    dataSource={dataSource}
                  />
                </div>
              </div>
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(UserList);

//https://www.fusioncharts.com/explore/integrations/front-end-integrations/react

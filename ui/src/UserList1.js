import React from "react";
import { Query } from "react-apollo";
import gql from "graphql-tag";
import "./UserList.css";
import { withStyles } from "@material-ui/core/styles";
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
              lastName
              title
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
            <Paper className={this.props.classes.root}>
              <Table className={this.props.classes.table}>
                <TableHead>
                  <TableRow>
                    <TableCell
                      key="firstName"
                      sortDirection={orderBy === "firstName" ? order : false}
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "firstName"}
                          direction={order}
                          onClick={() => this.handleSortRequest("firstName")}
                        >
                          First Name
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="lastName"
                      sortDirection={orderBy === "lastName" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-end"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "lastName"}
                          direction={order}
                          onClick={() => this.handleSortRequest("lastName")}
                        >
                          Last Name
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                    <TableCell
                      key="title"
                      sortDirection={orderBy === "title" ? order : false}
                      numeric
                    >
                      <Tooltip
                        title="Sort"
                        placement="bottom-start"
                        enterDelay={300}
                      >
                        <TableSortLabel
                          active={orderBy === "title"}
                          direction={order}
                          onClick={() => this.handleSortRequest("title")}
                        >
                          Title
                        </TableSortLabel>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.Employee.map(n => {
                    return (
                      <TableRow key={n._id}>
                        <TableCell component="th" scope="row">
                          {n.firstName}
                        </TableCell>
                        <TableCell numeric>{n.lastName}</TableCell>
                        <TableCell numeric>{n.title}</TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </Paper>
          );
        }}
      </Query>
    );
  }
}

export default withStyles(styles)(UserList);

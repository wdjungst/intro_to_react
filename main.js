class List extends React.Component{
  constructor(props) {
    super(props);
    this.state = { items: [], complete: 0, nextID: 0 };
    this.items = this.items.bind(this);
    this.updateItem = this.updateItem.bind(this);
    this.addItem = this.addItem.bind(this);
    this.deleteItem = this.deleteItem.bind(this);
  }

  items() {
    return this.state.items.map( item => {
      return(<Item key={item.id} {...item} update={this.updateItem} deleteItem={this.deleteItem} />)
    })
  }

  deleteItem(id) {
    this.setState({
      items: [ ...this.state.items.filter( item => item.id !== id ) ]
    })
  }

  updateItem(id, checked) {
    let index = this.state.items.findIndex( item => item.id === id )
    let items = [
      ...this.state.items.slice(0, index),
      {
        ...this.state.items[index],
        checked: !checked
      },
      ...this.state.items.slice(index + 1)
    ]
    this.setState({
      items: [
        ...items.filter( item => !item.checked ),
        ...items.filter( item => item.checked )
      ]
    })
  }

  addItem(e) {
    e.preventDefault()
    this.setState({
      items: [
        { name: this.refs.name.value, id: this.state.nextID, checked: false },
        ...this.state.items
      ],
      nextID: ++this.state.nextID
    })
    this.refs.name.value = '';
  }

  render(){
    return(
      <div className='center container'>
        <h1> To Do </h1>
        <CompleteCount complete={this.state.items.filter( item => item.checked ).length} total={this.state.items.length} />
        <form ref="todoForm" onSubmit={this.addItem}>
          <input placeholder='add item' type='text' ref='name' />
        </form>
        <hr/>
        <div className='row'>
          {this.items()}
        </div>
      </div>
     );
   }
}

const Item = ({ id, name, checked, update, deleteItem }) => (
  <div className="col s12">
    <div className="col m8" style={ checked ? { textDecoration: 'line-through', color: 'grey' } : {} }>
      {name}
    </div>
    <div className="col m3">
      <input type="checkbox" id={`item-${id}`} defaultChecked={checked} onChange={() => update(id, checked)} />
      <label htmlFor={`item-${id}`}>Complete?</label>
    </div>
    <div className="col m1">
      <i className="material-icons" onClick={() => deleteItem(id)} >delete</i>
    </div>
  </div>
)

class CompleteCount extends React.Component {
  render() {
    let total = this.props.total;
    let complete = this.props.complete;
    let percentage = total > 0 ? ((complete / total) * 100) : 0;
    let style = { color: 'black' }
    if (percentage < 50)
      style.color = 'red'
    else if (percentage >= 50 && percentage < 90)
      style.color = 'orange';
    else if (percentage >= 90)
      style.color = 'green'

    return (
      <div className="row">
        <div className="col s6 center">
          <span>{complete}/{total} complete</span>
        </div>
        <div className="col s6 center">
          <span style={style}>{percentage}% completed</span>
        </div>
      </div>
    );
  }
}

ReactDOM.render(<List />, document.getElementById('root'));

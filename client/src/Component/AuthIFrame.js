import React from "react"

class AuthIFrame extends React.Component {
	constructor(props) {
		super(props)
		this.state = {}
	}

	componentDidMount() {
		const { token, src, type} = this.props

		const method = "GET"
        console.log(token);
		const authorization = `Bearer ${token}`
		const headers = new Headers({ authorization, type })
		const options = { method, headers }
		console.log(options)
		fetch(src, options)
			.then(response => response.blob())
			.then(response => {
				var blob = new Blob([response], { type })
				const obj = URL.createObjectURL(blob)
				this.setState({ blobObject: obj })
			})
			.catch(e => console.error("Error", e))
	}

	render() {
		const { src, token, ...props } = this.props

		return <iframe src={this.state.blobObject} title={this.props.title} {...props}/>
	}
}


export default AuthIFrame;
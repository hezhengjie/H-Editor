/**
 * Created by hezhengjie on 2016/3/24.
 */
'use strict';
//模块导入
var $ = require('./jquery.min.js');
var path = require('path');
var React = require('react');
var ReactDOM = require('react-dom');
var AMUIReact = require('amazeui-react');
var marked = require('marked');
var cNames = require('classnames');
var style = require('./main.css');
var Topbar = AMUIReact.Topbar;
var CollapsibleNav = AMUIReact.CollapsibleNav;
var Nav = AMUIReact.Nav;
var NavItem = AMUIReact.NavItem;
var List = AMUIReact.List;
var ListItem = AMUIReact.ListItem;
var Grid = AMUIReact.Grid;
var Col = AMUIReact.Col;
var Article = AMUIReact.Article;
var ButtonToolbar = AMUIReact.ButtonToolbar;
var ButtonGroup = AMUIReact.ButtonGroup;
var Button = AMUIReact.Button;
var Icon = AMUIReact.Icon;
var Input = AMUIReact.Input;
var Form = AMUIReact.Form;
var Modal = AMUIReact.Modal;
var ModalTrigger = AMUIReact.ModalTrigger;
var Htopbar = React.createClass({
    getInitialState: function () {
        return {
            title: '',
            author: '',
            description: '',
            category: [],
            repository: '',
            username: '',
            password: '',
            theme_list:[],
            theme:''
        };
    },
    push:function(){
        $.ajax({
            url: 'http://localhost:8888/push',
            type: 'GET',
            success: function (data) {
                alert('发布成功');
            }.bind(this)
        });
    },
    onConfirm: function () {
        var title = $('input[name="title"]').val();
        var author = $('input[name="author"]').val();
        var description = $('textarea[name="description"]').val();
        var repository = $('input[name="repository"]').val();
        var username = $('input[name="username"]').val();
        var password = $('input[name="password"]').val();
        var theme = $('select[name="theme"]').val();
        var category = this.state.category;
        var data = {
            title: title,
            author: author,
            description: description,
            category: category,
            repository: repository,
            username: username,
            password: password,
            theme:theme
        };
        data = JSON.stringify(data);
        $.ajax({
            url: 'http://localhost:8888/setConfig',
            type: 'POST',
            data: data,
            success: function (data) {
            }.bind(this)
        });
        $.ajax({
            url: 'http://localhost:8888/getConfig',
            type: 'GET',
            success: function (data) {
                this.setState({
                    title: data.title,
                    author: data.author,
                    description: data.description,
                    category: data.category,
                    repository: data.repository,
                    username: data.username,
                    password: data.password,
                    theme:data.theme
                });
            }.bind(this)
        });
    },
    onCancel: function () {
        $.ajax({
            url: 'http://localhost:8888/getConfig',
            type: 'GET',
            success: function (data) {
                this.setState({
                    title: data.title,
                    author: data.author,
                    description: data.description,
                    category: data.category,
                    repository: data.repository,
                    username: data.username,
                    password: data.password,
                    theme:data.theme
                });
            }.bind(this)
        });
    },
    addTag: function () {
        var category = this.state.category;
        var new_tag = $('input[name="category"]').val();
        category.push(new_tag);
        this.setState({
            category: category
        });
    },
    removeTag: function (tag) {
        var category = this.state.category;
        category.splice(category.indexOf(tag), 1);
        this.setState({
            category: category
        });
    },
    componentDidMount: function () {
        $.ajax({
            url: 'http://localhost:8888/getConfig',
            type: 'GET',
            success: function (data) {
                this.setState({
                    title: data.title,
                    author: data.author,
                    description: data.description,
                    category: data.category,
                    repository: data.repository,
                    username: data.username,
                    password: data.password,
                    theme:data.theme

                });
            }.bind(this)
        });
        $.ajax({
            url: 'http://localhost:8888/getThemeList',
            type: 'GET',
            success: function (data) {
                this.setState({
                    theme_list:data
                });
            }.bind(this)
        });
    },
    render: function () {
        var props = {
            removeTag: this.removeTag,
            addTag: this.addTag
        };
        var Hconfig_setting = (
            <Modal type="prompt" title="基础设置">
                <form>
                    <table className="config_table">
                        <tbody>
                            <tr>
                                <td>
                                    <label>网站名称</label>
                                </td>
                                <td>
                                    <input type="text" name="title" className="am-modal-prompt-input" defaultValue={this.state.title}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>作者</label>
                                </td>
                                <td>
                                    <input type="text" name="author" className="am-modal-prompt-input" defaultValue={this.state.author}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>网站描述</label>
                                </td>
                                <td>
                                    <textarea type="text" name="description" className="am-modal-prompt-input" rows="5" >{this.state.description}</textarea>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>分类</label>
                                </td>
                                <td className="categary_wrap clearfix">
                                    <ul className="clearfix">
                        {
                            this.state.category.map(function (item) {
                                return(
                                    <li>
                                        <div className="tag">{item}</div>
                                        <div className="tag-delete" ref="delete_btn"  onClick={props.removeTag.bind(this, item)}>
                                            <i>X</i>
                                        </div>
                                    </li>
                                    )
                            })
                            }
                                    </ul>
                                    <div className="categary_add">
                                        <input type="text" name="category" className="am-modal-prompt-input"/>
                                        <Button amStyle="primary" amSize="xs" onClick={props.addTag}>添加分类</Button>
                                    </div>

                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>github地址</label>
                                </td>
                                <td>
                                    <input type="text" name="repository" className="am-modal-prompt-input" defaultValue={this.state.repository}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>github账号</label>
                                </td>
                                <td>
                                    <input type="text" name="username" className="am-modal-prompt-input" defaultValue={this.state.username}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>github密码</label>
                                </td>
                                <td>
                                    <input type="password" name="password" className="am-modal-prompt-input" defaultValue={this.state.password}/>
                                </td>
                            </tr>
                            <tr>
                                <td>
                                    <label>主题</label>
                                </td>
                                <td>
                                    <select name="theme" name="theme" className="am-modal-prompt-input" defaultValue={this.state.theme}>
                                       {
                                           this.state.theme_list.map(function (item) {
                                               return(
                                        <option value={item}>{item}</option>
                                                   )
                                           })
                                           }
                                    </select>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>

            </Modal>
            );
        return( <Topbar brand="H-Editor" toggleNavKey="nav">
            <CollapsibleNav eventKey="nav">
                <Nav topbar>
                    <NavItem href="javascript:void(0)" onClick={this.props.newPage.bind(this)}>新建文章</NavItem>
                    <ModalTrigger
                    modal={Hconfig_setting}
                    onCancel={this.onCancel}
                    onConfirm={this.onConfirm}>
                        <NavItem href="javascript:void(0)">基础设置</NavItem>
                    </ModalTrigger>
                    <NavItem href="javascript:void(0)" onClick={this.push}>发布网站</NavItem>

                </Nav>
            </CollapsibleNav>
        </Topbar>
            );

    }
});
var HcategoryList = React.createClass({
    //    设置初始的分类
    getInitialState: function () {
        return {
            category: [],
            select_category: "",
            pageNumber: "",
            pageList: [],
            page: ''
        };
    },
    componentDidMount: function () {
        $.ajax({
            url: 'http://localhost:8888/getCategory',
            type: 'GET',
            success: function (data) {
                this.setState({
                    category: data
                });
            }.bind(this)
        });
    },
    select: function (item) {
        this.setState({
            select_category: item
        });
        $.ajax({
            url: 'http://localhost:8888/getPage',
            type: 'GET',
            data: {
                select_category: item
            },
            success: function (data) {
                this.setState({
                    pageNumber: data.total,
                    pageList: data.list
                });
            }.bind(this)
        });

    },
    render: function () {
        var props = {
            select: this.select,
            select_category: this.state.select_category,
            page: this.state.page,
            returnPage: this.props.returnPage
        };
        return(
            <div className="nav_list">
                <div className="category_nav">
                    <dl className='category_list'>
                        <dt>分类</dt>
                        <dd>
                            <ul>
                    {

                        this.state.category.map(function (item) {
                            return(
                                <li  id={item} className={item == props.select_category ? "active" : ""} onClick={props.select.bind(this, item)}>
                                    <Icon icon="book" />
                                {item}
                                </li>
                                );
                        })

                        }

                            </ul>
                        </dd>
                    </dl>
                </div>
                <div className="page_nav">
                    <dl className='page_list'>
                        <dt>文章
                            <span className='page_total'>{this.state.pageNumber}</span>
                        </dt>
                        <dd>
                            <ul>
                        {
                            this.state.pageList.map(function (item) {
                                return(
                                    <li className={item == props.page ? "active" : "noactive"} onClick={props.returnPage.bind(this, props.select_category, item)}>
                                        <Icon icon="file-text-o" />
                                {item}
                                    </li>
                                    )
                            })
                            }
                            </ul>
                        </dd>
                    </dl>
                </div>
            </div>
            );
    }
});
var Hbutton_group = React.createClass({
    render: function () {
        return(
            <ButtonToolbar>
                <Button onClick={this.props.save}>
                    <Icon icon="save" />
                保存
                </Button>
                <Button amStyle="warning" onClick={this.props.delete}>
                    <Icon icon="remove" />
                删除
                </Button>
            </ButtonToolbar>
            );
    }
});
var Harticle = React.createClass({
    getInitialState: function () {
        return {
            title: '',
            category: '',
            content: '',
            category_list: []
        };
    },
    componentWillReceiveProps: function (nextProps) {
        $.ajax({
            url: 'http://localhost:8888/getPageContent',
            type: 'GET',
            data: {
                title: nextProps.title,
                category: nextProps.category
            },
            success: function (data) {
                this.setState({
                    title: data.title,
                    category: data.category,
                    content: data.content
                });

            }.bind(this)
        });
    },
    componentDidMount: function () {
        $.ajax({
            url: 'http://localhost:8888/getCategory',
            type: 'GET',
            success: function (data) {
                this.setState({
                    category_list: data
                });
            }.bind(this)
        });
    },
    handleChangeTitle: function (e) {
        this.setState({title: e.target.value});
    },
    handleChangeCategory: function (e) {
        this.setState({category: e.target.value});
    },
    returnContent: function (content) {
        this.setState({content: content});
    },
    save: function () {
        var data = {
            old_title: this.props.title,
            old_category: this.props.category,
            new_title: this.state.title,
            new_category: this.state.category,
            content: this.state.content
        };
        data = JSON.stringify(data);
        $.ajax({
            url: 'http://localhost:8888/save',
            type: 'POST',
            contentType: 'application/json',
            data: data,
            success: function (data) {
                alert(data);
                this.props.returnPage(this.state.category, this.state.title);

            }.bind(this)
        });
    },
    delete: function () {
        var data = {
            old_title: this.props.title,
            old_category: this.props.category
        };
        data = JSON.stringify(data);
        $.ajax({
            url: 'http://localhost:8888/delete',
            type: 'POST',
            contentType: 'application/json',
            data: data,
            success: function (data) {
                alert(data);
                this.props.returnPage('', '');
            }.bind(this)
        });
    },
    render: function () {
        return(
            <div className='article_edit'>
                <dl>
                    <dt>
                        <Hbutton_group save={this.save} delete={this.delete}></Hbutton_group>
                    </dt>
                    <dd>
                        <Form className="am-form" target="_blank" horizontal>
                            <Input type="text"  placeholder="标题" value={this.state.title} onChange={this.handleChangeTitle}/>
                            <Input type="select" wrapperClassName="am-u-sm-12" value={this.state.category} onChange={this.handleChangeCategory}>
                                <option value="">选择分类</option>
                            {
                                this.state.category_list.map(function (item) {
                                    return(
                                        <option value={item}>{item}</option>
                                        )
                                })
                                }

                            </Input>
                           <MdEditor content={this.state.content} returnContent={this.returnContent}/>

                        </Form>
                    </dd>
                </dl>

            </div>
            );
    }
});
var MdEditor = React.createClass({
    getInitialState: function () {
        return {
            panelClass: 'md-panel',
            mode: 'split',
            content:this.props.content|| '',
            result: marked(this.props.content || '')
        }
    },
    componentWillReceiveProps:function(nextProps){
        this.setState({
            content:nextProps.content
        });

    },
    componentDidMount: function () {
        this.textControl = React.findDOMNode(this.refs.editor);
        this.previewControl = React.findDOMNode(this.refs.preview);
    },
    componentWillUnmount: function () {
        this.textControl = null;
        this.previewControl = null;
    },
    render: function () {
        var panelClass = cNames([ 'md-panel'])
        var editorClass = cNames([ 'md-editor', { 'expand': this.state.mode === 'edit' } ])
        var previewClass = cNames([ 'md-preview', 'markdown', { 'expand': this.state.mode === 'preview', 'shrink': this.state.mode === 'edit' } ])
        return (
            <div className={panelClass}>
                <div className="md-menubar">
          {this._getModeBar()}
          {this._getToolBar()}
                </div>
                <div className={editorClass}>
                    <textarea ref="editor" name="content" value={this.state.content} onChange={this._onChange}></textarea>
                </div>
                <div className={previewClass} ref="preview" dangerouslySetInnerHTML={{ __html: this.state.result }}></div>
                <div className="md-spliter"></div>
            </div>
            )
    },
//判断是否被编辑
    isDirty: function () {
        return this._isDirty || false
    },
//    获取内容
    getValue: function () {
        return this.state.content
    },
//编辑工具栏
    _getToolBar: function () {
        return (
            <ul className="md-toolbar">
                <li className="tb-btn">
                    <a title="加粗" onClick={this._boldText}>
                        <i className="fa fa-bold"></i>
                    </a>
                </li>{/* bold */}
                <li className="tb-btn">
                    <a title="斜体" onClick={this._italicText}>
                        <i className="fa fa-italic"></i>
                    </a>
                </li>{/* italic */}
                <li className="tb-btn spliter"></li>
                <li className="tb-btn">
                    <a title="链接" onClick={this._linkText}>
                        <i className="fa fa-link"></i>
                    </a>
                </li>{/* link */}
                <li className="tb-btn">
                    <a title="引用" onClick={this._blockquoteText}>
                        <i className="fa fa-outdent"></i>
                    </a>
                </li>{/* blockquote */}
                <li className="tb-btn">
                    <a title="代码段" onClick={this._codeText}>
                        <i className="fa fa-code"></i>
                    </a>
                </li>{/* code */}
                <li className="tb-btn">
                    <a title="图片" onClick={this._pictureText}>
                        <i className="fa fa-picture-o"></i>
                    </a>
                </li>{/* picture-o */}
                <li className="tb-btn spliter"></li>
                <li className="tb-btn">
                    <a title="有序列表" onClick={this._listOlText}>
                        <i className="fa fa-list-ol"></i>
                    </a>
                </li>{/* list-ol */}
                <li className="tb-btn">
                    <a title="无序列表" onClick={this._listUlText}>
                        <i className="fa fa-list-ul"></i>
                    </a>
                </li>{/* list-ul */}
                <li className="tb-btn">
                    <a title="标题" onClick={this._headerText}>
                        <i className="fa fa-header"></i>
                    </a>
                </li>{/* header */}
            </ul>
            )
    },
//模式工具栏
    _getModeBar: function () {
        var checkActive = function (mode) {
                return cNames({active:this.state.mode=== mode});
        }.bind(this);
        return (
            <ul className="md-modebar">
                <li className="tb-btn pull-right" onClick={this.changeMode.bind(this,'preview')}>
                    <a className={checkActive('preview')}  title="预览模式">
                        <i className="fa fa-eye"></i>
                    </a>
                </li> { /* preview mode */ }
                <li className="tb-btn pull-right" onClick={this.changeMode.bind(this,'split')}>
                    <a  className={checkActive('split')}   title="分屏模式">
                        <i className="fa fa-columns"></i>
                    </a>
                </li> { /* split mode */ }
                <li className="tb-btn pull-right" onClick={this.changeMode.bind(this,'edit')} >
                    <a  className={checkActive('edit')}  title="编辑模式">
                        <i className="fa fa-pencil"></i>
                    </a>
                </li> { /* edit mode */ }
                <li className="tb-btn spliter pull-right"></li>
            </ul>
            )
    },
// markdown语法转换
    _onChange: function (e) {
        this._isDirty = true;//通知文本被编辑
        this.setState({content: this.textControl.value});
        if (this._ltr) clearTimeout(this._ltr);
        this._ltr = setTimeout(function () {

            this.setState({ result: marked(this.textControl.value) }
            )
            this.props.returnContent(this.state.content);
        }.bind(this), 300)
    },
//    模式转换
    changeMode:function(mode) {
            this.setState({
                mode:mode
            })
    },
// 编辑工具操作
    _preInputText: function (text, preStart, preEnd) {
        var start = this.textControl.selectionStart;
        var end = this.textControl.selectionEnd;
        var origin = this.textControl.value;

        if (start !== end) {
            var exist = origin.slice(start, end);
            text = text.slice(0, preStart) + exist + text.slice(preEnd);
            preEnd = preStart + exist.length
        }
        this.textControl.value = origin.slice(0, start) + text + origin.slice(end);
        // pre-select
        this.textControl.setSelectionRange(start + preStart, start + preEnd);
        this.setState({ content: this.textControl.value,result: marked(this.textControl.value) }); // change state
    },
    _boldText: function () {
        this._preInputText("**加粗文字**", 2, 6)
    },
    _italicText: function () {
        this._preInputText("_斜体文字_", 1, 5)
    },
    _linkText: function () {
        this._preInputText("[链接文本](www.yourlink.com)", 1, 5)
    },
    _blockquoteText: function () {
        this._preInputText("> 引用", 2, 4)
    },
    _codeText: function () {
        this._preInputText("```\ncode block\n```", 4, 14)
    },
    _pictureText: function () {
        this._preInputText("![alt](www.yourlink.com)", 2, 5)
    },
    _listUlText: function () {
        this._preInputText("- 无序列表项0\n- 无序列表项1", 2, 8)
    },
    _listOlText: function () {
        this._preInputText("1. 有序列表项0\n2. 有序列表项1", 3, 9)
    },
    _headerText: function () {
        this._preInputText("## 标题", 3, 5)
    }
})
var Hroot = React.createClass({
    getInitialState: function () {
        return {
            title: '',
            category: '',
            returnPage: this.returnPage
        };
    },
    returnPage: function (category, page) {
        this.setState({
            title: page,
            category: category

        });
    },

    newPage: function (item) {
        this.setState({
            title: '',
            category: ''
        });
    },
    render: function () {
        return(
            <div>
                <Htopbar newPage={this.newPage}></Htopbar>
                <Grid className="content">
                    <Col sm={3} >
                        <HcategoryList returnPage={this.returnPage}/>
                    </Col>
                    <Col sm={9} className="article_wrap" >
                        <Harticle {...this.state}/>
                    </Col>
                </Grid>
            </div>
            );
    }
});


ReactDOM.render(
    <Hroot/>,
    document.getElementById('root')
);
import styled from 'styled-components';


export const SearchWrapper = styled.div`
position: relative;
float: left;
.zoom {
    position: absolute;
    right: 5px;
    bottom: 5px;
    width: 30px;
    line-height: 30px;
    border-radius: 15px;
    text-align: center;
    &.focused {
        background: #777;
        color: #fff;
    }
}
`;

export const NavSearch = styled.input`
	width: 200px;
	height: 38px;
	padding: 0 30px 0 20px;
	margin-top: 9px;
	margin-left: 20px;
	box-sizing: border-box;
	border: none;
	outline: none;
	border-radius: 19px;
	background: #eee;
	font-size: 14px;
	color: #666;
	&::placeholder {
		color: #999;
	}
	&.focused {
		width: 260px;
    }
    &.slide-enter {
		transition: all .2s ease-out;
	}
	&.slide-enter-active {
		width: 260px;
	}
	&.slide-exit {
		transition: all .2s ease-out;
	}
	&.slide-exit-active {
		width: 200px;
	}
`;
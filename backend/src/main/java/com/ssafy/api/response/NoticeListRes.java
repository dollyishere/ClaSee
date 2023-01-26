package com.ssafy.api.response;

import com.ssafy.db.entity.board.Notice;
import io.swagger.annotations.ApiModel;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@ApiModel("NoticeRes")
public class NoticeListRes {

    Long id;

    String title;

    int hit;

    String regtime;


    public NoticeListRes(Notice notice) {
        this.id = notice.getId();
        this.title = notice.getTitle();
        this.hit = notice.getHit();
        this.regtime = notice.getRegtime();
    }
}

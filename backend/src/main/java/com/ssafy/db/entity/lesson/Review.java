package com.ssafy.db.entity.lesson;

import com.ssafy.db.entity.User.User;
import lombok.Getter;
import org.springframework.data.annotation.CreatedDate;

import javax.persistence.*;
import java.sql.Time;
import java.sql.Timestamp;

/*
* member : review = 1 : N
* lesson : review = 1 : N
*/
@Entity
@Getter
@Table(name = "REVIEW")
public class Review {

    @Id
    @GeneratedValue
    private Long id;

    private String title;
    private String content;
    @CreatedDate
    @Column(name = "regtime")
    private Timestamp regtime;
    private String img;
    private Long score;

    // 연결
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "lesson_id")
    private Lesson lesson;
}

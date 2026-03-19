import { Request, Response } from "express";
import pool from "../config/db";
import { get } from "http";

interface Product {
  id: number;
  name: string;
  description: string;
  txt: string;
  image_name: string;
  display_order: number;
}

export const getProducts = async (req: Request, res: Response) => {
  try {
    const page = Math.max(1, parseInt((req.query.page as string) || "1", 10));
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt((req.query.pageSize as string) || "10", 10)),
    );
    const search = (req.query.search as string) || "";

    const where: string[] = ["is_active = 1"];
    const params: any[] = [];

    if (search) {
      where.push("(name LIKE ? OR description LIKE ?)");
      const like = `%${search}%`;
      params.push(like, like);
    }

    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";
    const offset = (page - 1) * pageSize;

    // 总数查询
    const countSql = `SELECT COUNT(*) as total FROM products ${whereSql}`;
    const [countRows]: any = await pool.query(countSql, params);
    const total =
      countRows && countRows[0] && countRows[0].total
        ? Number(countRows[0].total)
        : 0;

    // 列表查询（返回前端需要的字段）
    const listSql = `SELECT id, name, description, txt, image_name, display_order
      FROM products ${whereSql}
      ORDER BY display_order ASC, created_at DESC
      LIMIT ? OFFSET ?`;
    const listParams = params.concat([pageSize, offset]);
    const [rows]: any = await pool.query(listSql, listParams);

    const items: Product[] = (rows || []).map((r: any) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      image_name: r.image_name,
      display_order: r.display_order,
    }));

    res.json({ code: 0, data: { items, total, page, pageSize } });
  } catch (error) {
    console.error("[产品查询错误]", error);
    res.status(500).json({
      code: -1,
      message: "Database query failed",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};

export default getProducts;

export const getProductDetail = async (req: Request, res: Response) => {
  try {
    const id = parseInt(<string>req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ code: -1, message: "无效的产品ID" });
    }

    const sql =
      "SELECT id, name, description, txt, image_name, display_order FROM products WHERE id = ? AND is_active = 1 LIMIT 1";
    const [rows]: any = await pool.query(sql, [id]);
    const product = rows && rows[0];
    if (!product) {
      return res.status(404).json({ code: -1, message: "产品未找到" });
    }

    res.json({ code: 0, data: product });
  } catch (error) {
    console.error("[产品详情查询错误]", error);
    res.status(500).json({
      code: -1,
      message: "查询产品详情失败",
      details: error instanceof Error ? error.message : String(error),
    });
  }
};
